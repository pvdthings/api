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
      dueBackDate: loan.get('Due Back')
  };
};

module.exports = {
  mapLoan
};