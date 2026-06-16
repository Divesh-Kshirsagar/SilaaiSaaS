# SilaaiSaaS API Documentation & Test Records
Generated via cURL tests.

## 1. Auth - Login
`POST /api/v1/auth/login`
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI5OTk5OTk5OTk5Iiwicm9sZSI6Ik9XTkVSIiwidXNlcklkIjoxLCJpYXQiOjE3ODE1OTQzMDcsImV4cCI6MTc4MTY4MDcwN30.rkQZVOhJOGUGYuzZvZqu0SSNIWy3YDB-LuBpJNmKTcQpXTfi5S610w2UbMTAY-Ez",
  "userId": 1,
  "name": "Owner",
  "role": "OWNER"
}
```
## 2. Shop - Get Shop Details
`GET /api/v1/shop`
```json
{
  "id": 1,
  "name": "Ramesh Tailors",
  "phone": "9876500000",
  "address": "123 MG Road, Bangalore"
}
```
## 3. Customer - Create
`POST /api/v1/customers`
```json
{
  "id": 1,
  "shop": {
    "id": 1,
    "name": "Ramesh Tailors",
    "phone": "9876500000",
    "address": "123 MG Road, Bangalore"
  },
  "name": "John Doe",
  "phone": "1234567890"
}
```
## 4. Customer - List
`GET /api/v1/customers`
```json
{
  "content": [
    {
      "id": 1,
      "shop": {
        "id": 1,
        "name": "Ramesh Tailors",
        "phone": "9876500000",
        "address": "123 MG Road, Bangalore"
      },
      "name": "John Doe",
      "phone": "1234567890"
    }
  ],
  "empty": false,
  "first": true,
  "last": true,
  "number": 0,
  "numberOfElements": 1,
  "pageable": {
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 20,
    "paged": true,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "unpaged": false
  },
  "size": 20,
  "sort": {
    "empty": true,
    "sorted": false,
    "unsorted": true
  },
  "totalElements": 1,
  "totalPages": 1
}
```
## 5. Measurement - Create
`POST /api/v1/customers/{id}/measurements`
```json
{
  "id": 1,
  "customer": {
    "id": 1,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore",
      "hibernateLazyInitializer": {}
    },
    "name": "John Doe",
    "phone": "1234567890"
  },
  "garmentType": "Shirt",
  "chest": 40.5,
  "waist": 34.0,
  "hip": null,
  "length": 29.0,
  "shoulder": 18.0,
  "sleeve": 25.0,
  "notes": "Slim fit",
  "updatedAt": "2026-06-16T12:48:27.691435954"
}
```
## 6. Garments - List
`GET /api/v1/garments`
```json
[
  {
    "id": 1,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore"
    },
    "name": "Men's Shirt",
    "basePrice": 350.0,
    "defaultFabricConsumptionMeters": 2.5
  },
  {
    "id": 2,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore"
    },
    "name": "Kurta",
    "basePrice": 500.0,
    "defaultFabricConsumptionMeters": 3.0
  },
  {
    "id": 3,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore"
    },
    "name": "Trousers",
    "basePrice": 400.0,
    "defaultFabricConsumptionMeters": 1.8
  }
]
```
## 7. Fabrics - List
`GET /api/v1/fabrics`
```json
[
  {
    "id": 1,
    "name": "Blue Cotton",
    "quantityAvailable": 50.0,
    "reorderLevel": 10.0,
    "lowStock": false
  },
  {
    "id": 2,
    "name": "White Linen",
    "quantityAvailable": 30.0,
    "reorderLevel": 8.0,
    "lowStock": false
  },
  {
    "id": 3,
    "name": "Black Polyester",
    "quantityAvailable": 20.0,
    "reorderLevel": 5.0,
    "lowStock": false
  }
]
```
## 8. Order - Create
`POST /api/v1/orders`
```json
{
  "id": 1,
  "orderNumber": "ORD-0001",
  "shop": {
    "id": 1,
    "name": "Ramesh Tailors",
    "phone": "9876500000",
    "address": "123 MG Road, Bangalore"
  },
  "customer": {
    "id": 1,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore"
    },
    "name": "John Doe",
    "phone": "1234567890"
  },
  "createdBy": {
    "id": 1,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore"
    },
    "name": "Owner",
    "role": "OWNER",
    "phone": "9999999999",
    "passwordHash": "$2a$10$9dextB8wF/WXgl5MpObrE.bJ3KQG2LcCgG1FvSaUlOhRhlCHzq2O6"
  },
  "bookingDate": "2026-06-16",
  "deliveryDate": "2026-06-30",
  "status": "DRAFT",
  "totalAmount": 350.0,
  "advancePaid": 500.0
}
```
## 9. Order - Confirm
`POST /api/v1/orders/{id}/confirm`
```json
{
  "id": 1,
  "orderNumber": "ORD-0001",
  "shop": {
    "id": 1,
    "name": "Ramesh Tailors",
    "phone": "9876500000",
    "address": "123 MG Road, Bangalore",
    "hibernateLazyInitializer": {}
  },
  "customer": {
    "id": 1,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore",
      "hibernateLazyInitializer": {}
    },
    "name": "John Doe",
    "phone": "1234567890",
    "hibernateLazyInitializer": {}
  },
  "createdBy": {
    "id": 1,
    "shop": {
      "id": 1,
      "name": "Ramesh Tailors",
      "phone": "9876500000",
      "address": "123 MG Road, Bangalore",
      "hibernateLazyInitializer": {}
    },
    "name": "Owner",
    "role": "OWNER",
    "phone": "9999999999",
    "passwordHash": "$2a$10$9dextB8wF/WXgl5MpObrE.bJ3KQG2LcCgG1FvSaUlOhRhlCHzq2O6",
    "hibernateLazyInitializer": {}
  },
  "bookingDate": "2026-06-16",
  "deliveryDate": "2026-06-30",
  "status": "CONFIRMED",
  "totalAmount": 350.0,
  "advancePaid": 500.0
}
```
## 10. Tasks - List
`GET /api/v1/tasks`
```json
[
  {
    "id": 1,
    "order": {
      "id": 1,
      "orderNumber": "ORD-0001",
      "shop": {
        "id": 1,
        "name": "Ramesh Tailors",
        "phone": "9876500000",
        "address": "123 MG Road, Bangalore",
        "hibernateLazyInitializer": {}
      },
      "customer": {
        "id": 1,
        "shop": {
          "id": 1,
          "name": "Ramesh Tailors",
          "phone": "9876500000",
          "address": "123 MG Road, Bangalore",
          "hibernateLazyInitializer": {}
        },
        "name": "John Doe",
        "phone": "1234567890",
        "hibernateLazyInitializer": {}
      },
      "createdBy": {
        "id": 1,
        "shop": {
          "id": 1,
          "name": "Ramesh Tailors",
          "phone": "9876500000",
          "address": "123 MG Road, Bangalore",
          "hibernateLazyInitializer": {}
        },
        "name": "Owner",
        "role": "OWNER",
        "phone": "9999999999",
        "passwordHash": "$2a$10$9dextB8wF/WXgl5MpObrE.bJ3KQG2LcCgG1FvSaUlOhRhlCHzq2O6"
      },
      "bookingDate": "2026-06-16",
      "deliveryDate": "2026-06-30",
      "status": "CONFIRMED",
      "totalAmount": 350.0,
      "advancePaid": 500.0,
      "hibernateLazyInitializer": {}
    },
    "assignedTo": {
      "id": 2,
      "shop": {
        "id": 1,
        "name": "Ramesh Tailors",
        "phone": "9876500000",
        "address": "123 MG Road, Bangalore",
        "hibernateLazyInitializer": {}
      },
      "name": "Suresh Tailor",
      "role": "TAILOR",
      "phone": "8888888888",
      "passwordHash": "$2a$10$Q.8Ja0Olt9RUIsDZIYHPfOWXOqkbpkKF.tBecnDyL9MSw/OKf9cxK",
      "hibernateLazyInitializer": {}
    },
    "taskType": "CUTTING",
    "status": "PENDING",
    "dueDate": "2026-06-30"
  }
]
```
## 11. Dashboard - Stats
`GET /api/v1/dashboard/stats`
```json
{
  "pendingOrders": 1,
  "todayDeliveries": 0,
  "lowStockCount": 0,
  "readyOrders": 0
}
```
