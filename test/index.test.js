const nock = require('nock')
// Requiring our app implementation
const lgtm = require('..')
const { Probot } = require('probot')
// Requiring our fixtures
const payload = require('./fixtures/issue_comment.created.lgtm')
const shipItBody = { body: ':shipit:' }

nock.disableNetConnect()

describe('Looks good to me (lgtm)', () => {
  let probot

  beforeEach(() => {
    probot = new Probot({})
    // Load our app into probot
    const app = probot.load(lgtm)

    // just return a test token
    app.app = () => 'test'
  })

  test('it automatically comments with the "Ship It" squirrel emoji when the repo owner comments LGTM.', async () => {
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    const scope = nock('https://api.github.com')
      .post('/repos/Repoowner/TestRepo/issues/1/comments', (body) => {
        expect(body).toMatchObject(shipItBody)
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'issues_comment', payload })
    expect(scope.isDone()).toBeTruthy()
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about testing with Nock see:
// https://github.com/nock/nock
