const { mapLoan } = require('../maps');

class LoanMock {
  constructor(object) {
    this.object = object;
  }

  get id() {
    return this.object['id'];
  }

  get(key) {
    return this.object[key] || [''];
  }
}

test('borrower', () => {
  const loan = new LoanMock({
    'Borrower': ['recB'],
    'Borrower Name': ['Alice'],
    'Borrower Email': ['alice@mail.com'],
    'Borrower Phone': ['+1 (555) 555-5555']
  });

  const result = mapLoan(loan, 'rec0');

  expect(result.borrower).toEqual({
    id: 'recB',
    name: 'Alice',
    contact: {
      email: 'alice@mail.com',
      phone: '+1 (555) 555-5555'
    }
  });
});

test('checkedInDate', () => {
  const loan = new LoanMock({ 'checked_in_date': '11/07/2022' });
  const result = mapLoan(loan, 'rec0');

  expect(result.checkedInDate).toEqual('11/07/2022');
});

test('checkedOutDate', () => {
  const loan = new LoanMock({ 'Checked Out': '10/31/2022' });
  const result = mapLoan(loan, 'rec0');

  expect(result.checkedOutDate).toEqual('10/31/2022');
});

test('dueBackDate', () => {
  const loan = new LoanMock({ 'Due Back': '12/01/2022' });
  const result = mapLoan(loan, 'rec0');

  expect(result.dueBackDate).toEqual('12/01/2022');
});

test('extensions', () => {
  const loan = new LoanMock({ 'extensions_count': 1 });
  const result = mapLoan(loan, 'rec0');

  expect(result.extensions).toEqual(1);
});

test('id', () => {
  const loan = new LoanMock({ id: 'recL' });
  const result = mapLoan(loan, 'rec0');

  expect(result.id).toEqual('recL');
});

test('notes', () => {
  const loan = new LoanMock({ 'Notes': 'noteworthy' });
  const result = mapLoan(loan, 'rec0');

  expect(result.notes).toEqual('noteworthy');
});

test('number', () => {
  const loan = new LoanMock({ 'Loan': '101' });
  const result = mapLoan(loan, 'rec0');

  expect(result.number).toEqual(101);
});

test('thing', () => {
  const loan = new LoanMock({
    'Borrowed Things': ['Hammer', 'Drill'],
    'Things': ['recThing0', 'recThing1'],
    'thing_numbers': ['100', '101']
  });

  const result = mapLoan(loan, 'recThing1');

  expect(result.thing).toEqual({
    id: 'recThing1',
    name: 'Drill',
    number: 101
  });
});