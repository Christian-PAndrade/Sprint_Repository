# GraphQL

## General Look

### Queries

    ```
    query {
        users {id, username, projectId, isAdmin}
    }
    ```

    or simply
    ```
    {
        users {id, username, projectId, isAdmin}
    }
    ```

### Mutations

    ```
    mutation {
        adduser(name: "It Works!", isAdmin: true, projectId: "5e56a69d1c9d4400003e4ba5") {username, isAdmin, projectId}
    }
    ```

## Queries

### No Arguments

    `users {id, username, projectId, isAdmin}`

### With Arguments

    ```
    userbyid(id: "5e56a48d1c9d4400003e4ba4") {id, username, projectId, isAdmin}
    ```

## Mutations

### Adding

    ```
    adduser(name: "It Works!", isAdmin: true, projectId: "5e56a69d1c9d4400003e4ba5") {username, isAdmin, projectId}
    ```

### Updating

    ```
    updateuser(id: "5e5ad41ad3ff5358a8d64146", name: "Actual Name", isAdmin: true, projectId: "5e56a69d1c9d4400003e4ba5") {username, isAdmin, projectId}
    ```

### Deleting

    `deleteuser(id: "5e5ad2809391e336b491dc50")`
