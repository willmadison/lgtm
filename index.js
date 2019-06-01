/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

let containsLGTMText = (comment) => {
  const lgtmRegEx = /lgtm/i
  return lgtmRegEx.test(comment)
}

let commentMadeByOwner = (commentor, owner) => {
  return commentor.toLowerCase() === owner.toLowerCase()
}

module.exports = app => {
  app.on('issues_comment.created', async context => {
    const comment = context.payload.comment.body
    const commentor = context.payload.comment.user.login
    const owner = context.payload.repository.owner.login
    if (containsLGTMText(comment) &&
        commentMadeByOwner(commentor, owner)) {
      const issueComment = context.issue({ body: ':shipit:' })
      return context.github.issues.createComment(issueComment)
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
