# React Nest.js Auth Boilerplate

The boilerplate project aims to provide a solid production-ready foundation for building your own projects so that you can focus on building features instead of setting up the basic infrastructure. You can try out the live demo [here](https://boilerplate.jschad.de/).

> [!IMPORTANT]
> This Readme is a work in progress and will be updated over time.

## Features

-   **Authentication**: Register, login, and logout with JWT.
-   **Complete Signup Flow**: Register with email, verify email, and login.
    -   **Email Verification**: Verify email addresses with a unique token.
    -   **Forgot Password**: Reset passwords with a unique token.
    -   **Google OAuth**: Login with Google.
-   **User Management**: View and edit profile details.
    -   **Upload Profile Picture**: Upload and crop profile pictures.
-   **Store Files**: Upload and download files.
    -   **S3 Storage**: Store files on S3-compatible storage.
    -   **Local Storage**: Alternatively store files on the local filesystem.
-   **Deployment**: Docker and docker-compose files for easy deployment.
-   **Internationalization**: Serve your application in different languages.
-   **Diagnostic Tools**: Optional support for monitoring and debugging.
    -   **Sentry**: Monitor and fix crashes in real-time.
    -   **Plausible**: Track user interactions without compromising privacy.

## Getting Started

Fork this repository and start coding your application. Please read this Documentation to understand how the boilerplate works and how you can customize it to your needs.

## Imprint

The data displayed on the imprint page is loaded from the following environment variables. In addition this data is also included all emails sent by the application.

-   `IMPRINT_CONTACT_1`
-   `IMPRINT_CONTACT_2`
-   `IMPRINT_CONTACT_3`
-   `IMPRINT_CONTACT_4`
-   `IMPRINT_COPYRIGHT`

## Privacy Policy

This application includes a dedicated endpoint to serve the privacy policy in different languages based on the user's request. This ensures compliance with data protection regulations like GDPR while offering a localized experience for users. The privacy policy itself is not included and must be provided separately.

### Initial Setup

The data protection policy files live in the `server/src/assets/privacy-policy/files` directory. On startup tries to read files of supported languages. Supported languages are defined in the `prisma.schema` file in the Language enum. For example, if `Language.DE` is defined you should have a `de.md` file in the `server/src/assets/privacy-policy/files` directory. By default the application will serve the `en.md` version if the requested language could not be loaded.

### During Development

-   Place your `.md` files in the `server/src/assets/privacy-policy/files` directory.
    -   Example: `de.md` for German, `en.md` for English.
    -   Note: The filenames should be in lowercase and match the language codes.

### During Deployment

You have 2 options to make deployment work including the privacy policy files.

1. **Option 1**: Remove the `server/src/assets/privacy-policy/files/.gitignore` file and add the privacy policy files to your repository. This is the easiest way to add the privacy policy files to your deployment.
2. **Option 2**: Mount a volume containing the privacy policy files to the `/app/server/assets/privacy-policy/files` directory. This way you can add the privacy policy files to your deployment without adding them to your repository. Add this to your `docker-compose.yml` file:

```
volumes:
    - ./directory/to/your/privacy/policy:/app/server/assets/privacy-policy/files:ro
```
