# Vencura

## ETH Provider

The provider is set in the `.env` file via `ETH_RPC` and loaded into the app through the `config` module.

- Provider: https://sepolia.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf
- Faucet: https://sepoliafaucet.com/

## Encryption

The `encryption` module illustrates how to encrypt a `mnemonic`. The purpose is to illustrate how the app could be extended to support multiple protocols. It is also possible to use `ethers` native `wallet` encryption like [`wallet.encrypt`](https://docs.ethers.org/v5/api/signer/#Wallet-encrypt)

## Development server

**Install**

- `npm i -g nx`

- `npm i`

Optional:
Install `vscode` extensions

**ENV**

- Create `env` file in `apps/api-core`:
  - `cp .env.example .env`

**Run**

- `nx run api-core:deps-up` (or `nx run api-core:deps-down`) to run project dependencies locally
- `nx run api-core:db-migration-run` to run migrations
- `nx run api-core:serve`

Navigate to http://localhost:3000/. The app will automatically reload if you change any of the source files.

### Endpoints

| Env   | Service | URL                           |
| ----- | ------- | ----------------------------- |
| local | API     | http://localhost:3000/api/v1/ |
| local | Swagger | http://localhost:3000/docs/   |

### Database

```bash
nx run api-core:db-schema-drop # drop schema
nx run api-core:db-migration-generate --name=<name> # generate migration (after entity change)
nx run api-core:db-migration-create --name=<name> # create migration
nx run api-core:db-migration-run # run migrations
nx run api-core:db-migration-revert # revert migrations
nx run api-core:db-seed-run # run seeds
```

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.
