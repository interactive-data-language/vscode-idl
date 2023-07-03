# Publishing

Yay! The worst part of VSCOde: publishing extensions.

Figuring out how to publish extensions is a nightmare, especially trying to deal with signing into Azure's services because L3H/NV5 hijacks the sign in process.

> Pro tip: you can sign into Azure using github, but you will have problems if you have a L3H/NV5 email address. Zach had to use his gmail account in order to sign in through GitHub.

> Main readme for publishing an extension: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## Adding New Members and Tokens

For new people getting added, you'll need a few things:

1. You will need to be added to our Azure group: https://dev.azure.com/idl-envi-developers

2. From the azure group, make a personal access token (easiest is to just give it full access, shouldn't be a problem if your account is just for the extension). Here is a guide:

https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token

3. From the command line, let's try to sign in and get your user ID. With your token, run the following:

```shell
vsce login idl
```

Then copy/paste your token and press enter.

If you see an error like this:

```
Error: Access Denied: 7e675c3d-8ac8-6deb-be21-855dd6f28cc8 needs the following permission(s) on the resource /idl to perform this action: View user permissions on a resource
```

Then you'll need your user ID to be added to the VSCode Marketplace Publisher.

Using the ID from the error message, you can be added as a member here: https://marketplace.visualstudio.com/manage/publishers/IDL?auth_redirect=True

4. Actually log in to make sure it works right once you have been added. You may need to wait a minute or two for access to take effect and, when you attempt to login again, make sure there are no extra spaces in the token.

## Publishing Process

Publishing is fairly straight forward once you have a token that works. Here are the steps you need to go through:

1. Make sure the CHANGELOG is updated with any new features/fixes

2. Bump the package.json version to a new number

3. Run tests using `npm run test-everything` and make sure everything passes

3.5. Fix tests, iterate on changes, and verify we can run all of our tests.

> Pro tip: you can run the lib tests with `npm run test-libs` and/or integration tests with `npm run make-integration-tests && npm run test-integration`

4. Package to make a VSIX file: `npm run package`

5. Deploy using `vsce publish`

6. On the GitHub repo, make a new release with a matching version number
