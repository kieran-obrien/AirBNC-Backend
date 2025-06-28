# AirBNC - Backend

## Overview

#### AirBNC is my capstone project for the Northcoders Software Development with Javascript course.

A fullstack web application, it showcases all the skills I learned over the course of the bootcamp. It aims to recreate the experience of the popular property rental site [airbnb](https://www.airbnb.co.uk).

As this is a showcase piece, instructions will be provided below on how to interact with both the **_test_** and **_dev_** data.

## ✅ Prerequisites

#### Make sure you have the following installed:

- Node.js (v22.15.0 or higher)

- PostgreSQL

### Install PostgreSQL

#### On Ubuntu/Debian:

```
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### On macOS (with Homebrew):

```bash
brew install postgresql
brew services start postgresql
```

#### On Windows:

Download and install from https://www.postgresql.org/download/windows/

## Local Install

- Clone the repo down locally:
  `git clone`
- Install dependencies:`npm i`

## 🧑🏻‍🔬 Working with Test Data

- Create a file named **_.env.test_** in root directory
- Provide relevant ENV's in file with this format:
  ```
  PGDATABASE=airbnc_test
  PGUSER=<psql-username>
  PGPASSWORD=<user-password>
  PGHOST=localhost
  PGPORT=<preferred port, eg. 5432>
  ```
- Create test database: `npm run create-test-db`
- Run any test script from **_package.json_** with: `npm run <test_script_name>`
- Test scripts will automatically seed the **_PGDATABASE_** referenced in .env.test

## 🧑🏻‍💻 Working with Dev Data

- Create a file named **_.env.dev_** in root directory
- Provide relevant ENV's in file with this format:
  ```
  PGDATABASE=airbnc_dev
  PGUSER=<psql-username>
  PGPASSWORD=<user-password>
  PGHOST=localhost
  PGPORT=<preferred port, eg. 5432>
  ```
- Create dev database: `npm run create-dev-db`
- Run the seed script: `npm run seed-db`
- This script will automatically seed the **_PGDATABASE_** reference in .env.dev as it will detect no tests running in Node

### This project is currently in development so this README will update as the project progresses.
