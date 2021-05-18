# Firebase NodeJS Firestore Function

A DDD application focused on separation of concerns and scalability.
Loosely coupling with clear dependency graphs provided by Inversion of Control.

![alt text](architecture.png 'Clean Architecture')

- [Firebase NodeJS Firestore Function](#firebase-nodejs-firestore-function)
  - [Getting Started](#getting-started)
  - [Project architecture](#project-architecture)
  - [Setup Development Environment](#setup-development-environment)
    - [Login Firebase](#login-firebase)
    - [Set environment configuration](#set-environment-configuration)
    - [Retrieve current environment configuration](#retrieve-current-environment-configuration)
    - [Start firestore for database (emulators)](#start-firestore-for-database-emulators)
    - [Start the dev environment](#start-the-dev-environment)
  - [Callable funntion](#callable-funntion)
  - [Migration & Seeding](#migration--seeding)
  - [VS Code](#vs-code)
  - [Troubleshooting](#troubleshooting)

## Getting Started

...

## Project architecture

    .
    └── src
        ├── api # Layer that exposes application to external world (primary adapters)
        │   └── http # Exposes application over HTTP protocol
        ├── app # Layer that composes application use cases
        ├── domain # Business domain classes and everything that composes domain model
        ├── infra # Communication with what is external of application
        └── dist # Common functionalities

## Setup Development Environment

### Login Firebase

```sh
$ firebase login
$ firebase use develop
```

_Note: You have install GPG Suit if it hasn't been installed on your PC yet. [Learn more](https://www.gnupg.org/download/)._

### Set environment configuration

```sh
yarn functions:set-env
```

### Retrieve current environment configuration

```sh
yarn functions:export-env
```

### Start firestore for database (emulators)

```sh
yarn firestore
```

### Start the dev environment

Open another terminal to start the development server:

```sh
yarn dev
```

## Callable funntion

The Cloud Functions for Firebase client SDKs let you call functions directly from a Firebase app. [Learn more](https://firebase.google.com/docs/functions/callable).

**Define a funtion**

The following is the sample callable function. You can define other functions at `src/app/functions`:

```ts
export const testFirestoreCreate = functions
    .runWith(runtimeOptions)
    .region(region)
    .https.onCall(async (data, context) => {
        const service = Container.get<UserService>(TYPES.UserService);
        const entity: Partial<IUserEntity> = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            country: data.country || '',
            region: data.region || '',
            authId: context.auth?.uid || ''
        };

        const user = entityFactory(User, entity);
        const userData = await service.create(user);

        return userData;
    });
```

## Migration & Seeding

The database seeding provides an easy way to generate sample data in the database using seed classes.

```ts
// File: src/infra/database/migration/seeding/user.ts

@provide(TYPES.UserSeeding)
class UserSeeding implements ISeeding {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async run() {
    // ...
  }
}
```

How to use it in CLI:

1. Open file `src/cli/seeding.ts` then added the new seeding class.

```ts
type ISeedingType = 'UserSeeding';

class Seeding {
  #seedings: ISeedingType[] = ['UserSeeding'];
}
```

2. Build & Run seedings

Before run seedings using CLI, you must use firebase function shell to run user seeding first.

```sh
$ yarn shell
```

```sh
> userSeeding({})
```

Run other seedings

```sh
$ cd /path/to/project
$ yarn build && chmod +x ./dist/cli/index.js
$ yarn tools
# Run single seeding
$ ./dist/cli/index.js --seed UserSeeding
$ # Run all seeding with
$ ./dist/cli/index.js --seedall
```

## VS Code

Automatically fix code in VS Code

```js
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

## Troubleshooting
