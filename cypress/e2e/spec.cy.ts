const email = "super@super.com"
const password = "123"

const testingUsername = "testing User"
const testingUserEmail = "testing@user.com"


describe('Root Navigation', () => {
  it('Visits the root of the project', () => {
    cy.visit('/')
    cy.url().should('include', 'login')
  })
})



describe('Root Navigation Redirect', () => {
  it('Visits the root page and redirects', () => {
    cy.visit('/')
    cy.contains('Please sign in')
  })
})

describe('Log In Validation', () => {
  it('Attemps an invalid login and reflects an error', () => {
    cy.visit('/')
    cy.get('#emailaddress').type('fake@email.com')
    cy.get('#password').type('123')
    cy.contains('Sign in').click()
    cy.contains('Sign In Error')
  })
})



describe('Log In', () => {
  it('Attempts a valid login', () => {
    cy.login(email, password);
    cy.contains('Group One')
  })


})

describe('Groups', () => {
  var groupname = "Test Group"


  it('Attemps to view a group', () => {
    cy.visit('/')
    cy.get('#emailaddress').type(email)
    cy.get('#password').type(password)
    cy.contains('Sign in').click()
    //cy.visit('/groups')
    cy.contains('Group One')
    cy.contains('View').click()
  })

  it('Create a new group, join the group', () => {
    cy.login(email, password);
    cy.get('#createNewGroupButton').click()
    cy.get('#groupName').type(groupname)
    cy.get('#newchannel').type("General");
    cy.contains('Add Channel').click();
    cy.get('#newchannel').type("Other");
    cy.contains('Add Channel').click();
    cy.contains('Create Group').click();
    cy.get('#groupdiv > :nth-child(3)').click()
    cy.contains(groupname);
    cy.contains("Chat");
  });

  it('Create a new Channel, Navigate to the new channel', () => {
    cy.login(email, password);
    cy.get('.Test > .btn').click()
    cy.get('#channeldiv > .btn').click()
    cy.get('#newchannel').type('new Channel');
    cy.get('#channeldiv > .btn').click();
    cy.get('#channelcontainer > :nth-child(3)').click()
  });

  it('Open a group, Send a message', () => {
    cy.login(email, password);
    cy.get('.Test > .btn').click()
    cy.get('.form-control').type('Hello There');
    cy.get('#chatbox > :nth-child(2)').click();
    cy.contains("Hello There")
  });

  it('New Group Delete', () => {
    cy.login(email, password);
    cy.get('.Test > .btn').click()
    cy.get('#groupdiv > .btn-outline-secondary').click()
    cy.get('.btn-danger').click()
  });
})

describe('Users', () => {
  it('Nav to Users', () => {
    cy.login(email, password);
    cy.get('#nav-Users').click()
  })

  it('Create New User', () => {
    cy.login(email, password);
    cy.get('#nav-Users').click();
    cy.get('#addNewUserButton').click();
    cy.get('#username').type(testingUsername)
    cy.get('#newUserEmail').type(testingUserEmail)
    cy.get('#createNewUserButton').click();
    cy.contains(testingUsername).should('include.text', testingUsername)
  });

  it('View New User Profile', () => {

    cy.login(email, password);
    cy.get('#nav-Users').click();
    cy.contains(testingUsername).click()
    cy.contains(testingUsername).should('include.text', testingUsername)
  })

  it('Promote User to group and super admin', () => {

    cy.login(email, password);
    cy.get('#nav-Users').click();
    cy.contains(testingUsername).click()
    cy.get('#promoteToSuperAdmin').click();
    cy.get('#roles').should('include.text', 'SuperAdmin');

    cy.get('#promoteToGroupAdmin').click();
    cy.get('#roles').should('include.text', 'GroupAdmin');
  })

  it('Delete new user', () => {

    cy.login(email, password);
    cy.get('#nav-Users').click();
    cy.contains(testingUsername).click();
    cy.get('#deleteAccount').click();
    cy.get('#deleteAccount').click();
  })

  it('Create New User Again to test requests', () => {
    cy.login(email, password);
    cy.get('#nav-Users').click();
    cy.get('#addNewUserButton').click();
    cy.get('#username').type(testingUsername)
    cy.get('#newUserEmail').type(testingUserEmail)
    cy.get('#createNewUserButton').click();
    cy.contains(testingUsername).should('include.text', testingUsername)
  });

  it('Sign In With Created Test User, Request Approval to join group', () => {
    cy.login(testingUserEmail, password);
    cy.get('.Four > .btn').click();
    cy.get('#requestApprovalToJoin').click()
    cy.get('.ng-trigger').should('include.text', 'Approval Requested');

  });

  it('Check if approval request exists', () => {
    cy.login(email, password);
    cy.get('#nav-Requests').click();
    cy.get('.list-group-item').should('include.text', testingUsername)
  });

  it('Approve Request', () => {
    cy.login(email, password);
    cy.get('#nav-Requests').click();
    cy.get('.list-group-item').should('include.text', testingUsername);
    cy.get('.btn-outline-success').click();
    cy.get('#nav-Groups').click()
    cy.get('.Four > .btn').click();
    cy.get('#groupdiv > :nth-child(3)').click()
  });

  // it('Update User Details', () => {
  //   cy.login(email, password);
  //   cy.get('.dropdown > .d-flex').click();
  //   cy.get(':nth-child(1) > .dropdown-item').click();
  //   cy.get('#username').type('{selectAll}Dooper');
  //   cy.get('#email').type('.au')
  //   cy.get('#password').type('1234');
  //   cy.get('.btn-info').click()
  //   cy.get('#updateSuccess').should('include.text', "Updated")

  //   cy.get('#optionsList').click()
  //   cy.get('#signOut').click

  //   cy.login(email+'.au', '1234');
  //   cy.get('#username').type('{selectAll} Dooper');
  //   cy.get('#email').type('{backspace}	{backspace}	{backspace}	')
  //   cy.get('#password').type('1234');
  //   cy.get('.btn-info').click()

  // });


})