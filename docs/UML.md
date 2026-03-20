# UML – PI-Food-Server

## 1. Diagrama de Clases

```mermaid
classDiagram
    class Recipe {
        +UUID id
        +String name
        +String image
        +Text summary
        +Integer healthScore
        +Text steps
        +Boolean created
        +addDiet(diet)
    }

    class Diet {
        +Integer id
        +String name
    }

    class recipe_diet {
        +UUID recipeId
        +Integer dietId
    }

    Recipe "many" -- "many" Diet : belongs to many
    Recipe .. recipe_diet
    Diet .. recipe_diet
```

---

## 2. Diagrama Entidad-Relación (ER)

```mermaid
erDiagram
    RECIPE {
        uuid    id          PK
        string  name        "NOT NULL, UNIQUE"
        string  image
        text    summary     "NOT NULL"
        integer healthScore "NOT NULL"
        text    steps       "NOT NULL"
        boolean created     "DEFAULT true"
    }

    DIET {
        integer id   PK  "AUTOINCREMENT"
        string  name     "NOT NULL, UNIQUE"
    }

    RECIPE_DIET {
        uuid    recipeId FK
        integer dietId   FK
    }

    RECIPE ||--o{ RECIPE_DIET : "has"
    DIET   ||--o{ RECIPE_DIET : "has"
```

---

## 3. Diagrama de Componentes

```mermaid
graph TD
    Client["🌐 Cliente HTTP"]

    subgraph Server["Express Server (index.js / app.js)"]
        MW["Middleware\n(bodyParser · cookieParser · morgan · CORS)"]
        Router["Router Principal\n(routes/index.js)"]

        subgraph RecipesStack["Stack de Recetas"]
            RR["recipesRouter.js"]
            RH["recipesHandlers.js"]
            CC["Controllers\n· getAllRecipes\n· getRecipebyId\n· createRecipe\n· recipeUpdate\n· recipeDelete\n· searchRecipesByName"]
        end

        subgraph DietStack["Stack de Dietas"]
            DR["dietRouter.js"]
            DH["dietHandlers.js"]
            DC["DietController.js"]
        end
    end

    subgraph Data["Capa de Datos"]
        DB[("PostgreSQL\n(Sequelize ORM)")]
        API["Spoonacular API\n(externa)"]
        Utils["utils/getData.js\n(mapApi)"]
    end

    Client --> MW
    MW --> Router
    Router --> RR
    Router --> DR
    RR --> RH
    DR --> DH
    RH --> CC
    DH --> DC
    CC --> DB
    CC --> Utils
    DC --> DB
    DC --> Utils
    Utils --> API
```

---

## 4. Diagrama de Secuencia – GET /recipes (todos)

```mermaid
sequenceDiagram
    actor Client
    participant Handler as getRecipesHandler
    participant Controller as getAllRecipes
    participant DB as PostgreSQL
    participant Util as mapApi()
    participant API as Spoonacular API

    Client->>Handler: GET /recipes
    Handler->>Controller: getAllRecipes()
    Controller->>DB: findAll({ include: Diet })
    DB-->>Controller: [DB recipes]
    Controller->>Util: mapApi()
    Util->>API: GET /recipes/complexSearch?apiKey=...
    API-->>Util: { results: [...] }
    Util-->>Controller: [API recipes]
    Controller-->>Handler: [...DB recipes, ...API recipes]
    Handler-->>Client: 200 JSON Array
```

---

## 5. Diagrama de Secuencia – GET /recipes?name=query (búsqueda)

```mermaid
sequenceDiagram
    actor Client
    participant Handler as getRecipesHandler
    participant Controller as searchRecipesByName
    participant DB as PostgreSQL
    participant Util as mapApi()
    participant API as Spoonacular API

    Client->>Handler: GET /recipes?name=pasta
    Handler->>Controller: searchRecipesByName("pasta")
    Controller->>DB: findAll({ where: { name: iLike "%pasta%" } })
    DB-->>Controller: [DB matches]
    Controller->>Util: mapApi()
    Util->>API: GET /recipes/complexSearch?apiKey=...
    API-->>Util: [100 recipes]
    Util-->>Controller: [API recipes]
    Controller-->>Handler: [...DB matches, ...API matches]

    alt Hay resultados
        Handler-->>Client: 200 JSON Array
    else Sin resultados
        Handler-->>Client: 404 { error: "No hay concidencia en la busqueda" }
    end
```

---

## 6. Diagrama de Secuencia – GET /recipes/:id

```mermaid
sequenceDiagram
    actor Client
    participant Handler as getRecipebyIdHandler
    participant Controller as getRecipebyId
    participant DB as PostgreSQL
    participant API as Spoonacular API

    Client->>Handler: GET /recipes/:id

    alt ID numérico (API)
        Handler->>Controller: getRecipebyId(id, "API")
        Controller->>API: GET /recipes/{id}/information?apiKey=...
        API-->>Controller: recipe data
        Controller-->>Handler: mapped recipe object
    else ID UUID (DB)
        Handler->>Controller: getRecipebyId(id, "DB")
        Controller->>DB: findByPk(id, { include: Diet })
        DB-->>Controller: recipe record
        Controller-->>Handler: recipe object
    end

    alt Encontrado
        Handler-->>Client: 200 JSON Recipe
    else No encontrado
        Handler-->>Client: 400 { error: "..." }
    end
```

---

## 7. Diagrama de Secuencia – POST /recipes (crear)

```mermaid
sequenceDiagram
    actor Client
    participant Handler as createRecipesHandler
    participant Controller as createRecipe
    participant DB as PostgreSQL

    Client->>Handler: POST /recipes\n{ name, image, summary, healthScore, steps, diets }

    Handler->>Controller: createRecipe(name, image, summary, healthScore, steps, diets)

    Controller->>DB: findOne({ where: { name } })
    DB-->>Controller: existing?

    alt Nombre ya existe
        Controller-->>Handler: Error "Recipe name already exists"
        Handler-->>Client: 404 { error }
    else Nombre disponible
        Controller->>DB: Recipe.create({ name, image, summary, healthScore, steps })
        DB-->>Controller: new Recipe
        loop Por cada dieta
            Controller->>DB: Diet.findOrCreate({ name })
            DB-->>Controller: diet
            Controller->>DB: recipe.addDiet(diet)
        end
        Controller-->>Handler: new Recipe
        Handler-->>Client: 201 JSON Recipe
    end
```

---

## 8. Diagrama de Secuencia – PUT /recipes (actualizar)

```mermaid
sequenceDiagram
    actor Client
    participant Handler as updateRecipesHandler
    participant Controller as recipeUpdate
    participant DB as PostgreSQL

    Client->>Handler: PUT /recipes\n{ id, name, image, summary, healthScore, steps, diets }

    Handler->>Controller: recipeUpdate(id, name, image, summary, healthScore, steps, diets)

    alt ID no es UUID válido
        Controller-->>Handler: Error "Enter an id in UUID format"
        Handler-->>Client: 404 { error }
    else UUID válido
        Controller->>DB: findByPk(id)
        DB-->>Controller: recipe?
        alt No encontrado
            Controller-->>Handler: Error "Recipe Not Found"
            Handler-->>Client: 404 { error }
        else Encontrado
            Controller->>DB: recipe.update({ fields... })
            opt Hay dietas nuevas
                loop Por cada dieta
                    Controller->>DB: Diet.findOrCreate({ name })
                    Controller->>DB: recipe.addDiet(diet)
                end
            end
            Controller->>DB: recipe.save()
            Controller-->>Handler: "Successfully modified recipe"
            Handler-->>Client: 200 { msg }
        end
    end
```

---

## 9. Diagrama de Secuencia – DELETE /recipes/:id

```mermaid
sequenceDiagram
    actor Client
    participant Handler as deleteRecipesHandler
    participant Controller as recipeDelete
    participant DB as PostgreSQL

    Client->>Handler: DELETE /recipes/:id

    Handler->>Controller: recipeDelete(id)

    alt ID no es UUID válido
        Controller-->>Handler: Error "Enter an id in UUID format"
        Handler-->>Client: 400 { error }
    else UUID válido
        Controller->>DB: findOne({ where: { id } })
        DB-->>Controller: recipe?
        alt No encontrado
            Controller-->>Handler: Error "Recipe Not Found"
            Handler-->>Client: 400 { error }
        else Encontrado
            Controller->>DB: recipe.destroy()
            Controller-->>Handler: "Deleted recipe"
            Handler-->>Client: 200 { msg }
        end
    end
```

---

## 10. Diagrama de Secuencia – GET /diet

```mermaid
sequenceDiagram
    actor Client
    participant Handler as getDietHandler
    participant Controller as getDiet
    participant DB as PostgreSQL
    participant Util as mapApi()
    participant API as Spoonacular API

    Client->>Handler: GET /diet
    Handler->>Controller: getDiet()
    Controller->>DB: Diet.findAll()
    DB-->>Controller: diets[]

    alt Base de datos vacía
        Controller->>Util: mapApi()
        Util->>API: GET /recipes/complexSearch?apiKey=...
        API-->>Util: [recipes]
        Util-->>Controller: [API recipes]
        loop Por cada receta y sus dietas
            Controller->>DB: Diet.findOrCreate({ name })
        end
        Controller->>DB: Diet.findAll()
        DB-->>Controller: diets[]
    end

    Controller-->>Handler: diets[]

    alt Éxito
        Handler-->>Client: 200 JSON Array of Diets
    else Error
        Handler-->>Client: 401 { error }
    end
```

---

## 11. Diagrama de Actividad – Ciclo de vida de una petición

```mermaid
flowchart TD
    A([Inicio: Petición HTTP]) --> B[Middleware: bodyParser / cookieParser / CORS / morgan]
    B --> C{¿Ruta válida?}
    C -- No --> D[Error 404 - Ruta no encontrada]
    C -- Sí --> E{¿Tipo de ruta?}

    E -- /recipes --> F{¿Método HTTP?}
    E -- /diet --> G[getDietHandler]

    F -- GET sin query --> H[getAllRecipes]
    F -- GET ?name=query --> I[searchRecipesByName]
    F -- GET /:id --> J[getRecipebyId]
    F -- POST --> K[createRecipe]
    F -- PUT --> L[recipeUpdate]
    F -- DELETE --> M[recipeDelete]

    H --> N{¿Origen?}
    I --> N
    J --> N
    N -- DB --> O[(PostgreSQL)]
    N -- API --> P[Spoonacular API]

    K --> O
    L --> O
    M --> O
    G --> O
    G --> P

    O --> Q[Formatear respuesta JSON]
    P --> Q
    Q --> R([Respuesta al cliente])
    D --> R
```
