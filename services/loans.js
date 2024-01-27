const { base, Table } = require('../db');

const loans = base(Table.Loans);

const mapLoan = (loan, thingId) => {
    const thingNames = loan.get('Borrowed Things');
    const thingIndex = loan.get('Things').indexOf(thingId);
    const thingNumber = loan.get('thing_numbers')[thingIndex];
    const email = loan.get('Borrower Email');
    const phone = loan.get('Borrower Phone');

    return {
        id: loan.id,
        number: Number(loan.get('Loan')),
        borrower: {
            id: loan.get('Borrower')[0],
            name: loan.get('Borrower Name')[0],
            contact: {
                email: email ? email[0] : undefined,
                phone: phone ? phone[0] : undefined
            }
        },
        thing: {
            id: thingId,
            number: Number(thingNumber),
            name: thingNames[thingIndex]
        },
        notes: loan.get('Notes'),
        extensions: loan.get('extensions_count'),
        checkedOutDate: loan.get('Checked Out'),
        checkedInDate: loan.get('checked_in_date'),
        dueBackDate: loan.get('Due Back'),
        remindersSent: Number(loan.get('reminders_sent')) || 0
    };
};

const fetchLoans = async ({ includeClosed }) => {
    const view = includeClosed ? 'api_all_loans' : 'api_open_loans';
    const results = await loans.select({
        view: view,
        fields: [
            'Loan',
            'Borrower',
            'Borrower Name',
            'Borrower Email',
            'Borrower Phone',
            'Notes',
            'Things',
            'Borrowed Things',
            'Returned Things',
            'Checked Out',
            'checked_in_date',
            'Due Back',
            'thing_numbers'
        ],
        pageSize: 100
    }).all();

    const fetchedLoans = [];

    // Because of the Airtable schema, we have to map each record to multiple loans, one for each thing
    results.forEach(r => {
        const returnedThings = r.get('Returned Things') || [];
        r.get('Things').filter(t => !returnedThings.includes(t))
            .forEach(thingId => fetchedLoans.push(mapLoan(r, thingId)));
    });

    return fetchedLoans;
};

const fetchLoan = async ({ loanId, thingId }) => {
    const loan = await loans.find(loanId);
    return loan ? mapLoan(loan, thingId) : null;
};

const createLoan = async ({
    borrowerId,
    thingIds,
    checkedOutDate,
    dueBackDate,
    notes
}) => {
    const loan = await loans.create({
        "Borrower": [borrowerId],
        "Things": thingIds,
        "Checked Out": checkedOutDate,
        "Due Back": dueBackDate,
        "Status": "Active",
        "Returned Things": [],
        "Notes": notes || "This loan was opened by the PVD Things API."
    });

    return loan.id;
};

const updateLoan = async ({
    loanId,
    thingId,
    dueBackDate,
    checkedInDate, // <- We can't use the value until we shift to the [1 Loan]:[1 Thing] paradigm
    notes
}) => {
    const loan = await loans.find(loanId);

    const fields = {};
    
    if (dueBackDate && dueBackDate !== '') {
        fields["Due Back"] = dueBackDate;
    }

    if (notes != undefined) {
        fields["Notes"] = notes;
    }

    const returnedThings = loan.get("Returned Things") || [];

    if (checkedInDate === '') {
        fields["Returned Things"] = returnedThings.filter(t => t.id === thingId);
    }

    if (checkedInDate && checkedInDate !== '') {
        fields["Returned Things"] = [...returnedThings, thingId];
    }

    await loans.update([
        {
            "id": loanId,
            fields
        }
    ]);
};

module.exports = {
    fetchLoans,
    fetchLoan,
    createLoan,
    updateLoan
};