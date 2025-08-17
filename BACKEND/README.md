# Liste Complète des API du Système Hôtelier (pour Postman) 🚀

**Note très importante :** Pour toutes les requêtes **#PRIVÉES**, tu dois inclure un **JWT valide** dans l'en-tête de ta requête.

- **Dans Postman :**
    
    1. Ouvre l'onglet **`Authorization`** de ta requête.
        
    2. Sélectionne **`Bearer Token`** dans le menu déroulant `TYPE`.
        
    3. Colle ton JWT (obtenu après `/api/auth/login` ou `/api/customer-auth/login`) dans le champ **`Token`**.
        

## #PUBLIC: (Accès sans authentification)

### 1. Authentification Staff (`/api/auth`)

- **POST** `/api/auth/register`
    
    - _Description:_ Enregistre un nouvel utilisateur staff.
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "fullName": "Staff Admin",
            "mail": "admin@hotel.com",
            "password": "AdminPassword123!",
            "imageUrl": null,
            "phone": "0340000000",
            "role": "ADMIN"
        }
        ```
        
- **POST** `/api/auth/login`
    
    - _Description:_ Authentifie un utilisateur staff et retourne un JWT.
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "mail": "admin@hotel.com",
            "password": "AdminPassword123!"
        }
        ```
        

### 2. Authentification Client (`/api/customer-auth`)

- **POST** `/api/customer-auth/register`
    
    - _Description:_ Permet à un nouveau client de créer son propre compte.
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "fullName": "Client Test",
            "mail": "client@test.com",
            "password": "ClientPassword123!",
            "phone": "0321234567",
            "address": "10 Rue des Fleurs, Antananarivo"
        }
        ```
        
- **POST** `/api/customer-auth/login`
    
    - _Description:_ Permet à un client existant de se connecter et d'obtenir un JWT.
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "mail": "client@test.com",
            "password": "ClientPassword123!"
        }
        ```
        
    - _Réponse attendue :_ Un JSON contenant un `token` et les informations du client (`user`).
        

### 3. Consultation des Chambres (`/api/rooms`)

- **GET** `/api/rooms`
    
    - _Description:_ Récupère toutes les chambres disponibles.
        
    - _Permissions:_ **PUBLIC**
        
- **GET** `/api/rooms/{id}`
    
    - _Description:_ Récupère les détails d'une chambre spécifique par ID.
        
    - _Permissions:_ **PUBLIC**
        

### 4. Consultation des Chambres Disponibles pour Réservation (`/api/bookings/available-rooms`)

- **GET** `/api/bookings/available-rooms`
    
    - _Description:_ Récupère les chambres disponibles pour une période donnée et capacité.
        
    - _Permissions:_ **PUBLIC**
        
    - _Paramètres de requête (query params) obligatoires :_ `checkInDate`, `checkOutDate`, `numAdults`
        
    - _Paramètres de requête (query params) optionnels :_ `numChildren`
        
    - _Exemple d'URL:_ `/api/bookings/available-rooms?checkInDate=2025-09-01&checkOutDate=2025-09-05&numAdults=2&numChildren=1`
        

## #PRIVÉ: (Accès avec JWT valide dans l'en-tête `Authorization: Bearer <token>`)

### 5. Gestion des Utilisateurs Staff (`/api/users`)

- **GET** `/api/users`
    
    - _Description:_ Récupère tous les utilisateurs staff.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/users/{id}`
    
    - _Description:_ Récupère un utilisateur staff par ID.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou l'utilisateur lui-même.
        
- **PUT** `/api/users/{id}`
    
    - _Description:_ Met à jour un utilisateur staff.
        
    - _Permissions:_ `ADMIN`, ou l'utilisateur lui-même. (Le rôle ne peut être modifié que par un `ADMIN`).
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "fullName": "Staff Admin Mis à Jour",
            "mail": "updated.admin@hotel.com",
            "phone": "0340000002",
            "imageUrl": "http://example.com/new_image.jpg",
            "online": true,
            "password": "NewSecurePassword!"
            // Si role est inclus, il ne peut être modifié que par un ADMIN.
            // "role": "EDITOR"
        }
        ```
        
- **DELETE** `/api/users/{id}`
    
    - _Description:_ Supprime un utilisateur staff.
        
    - _Permissions:_ `ADMIN`
        
- **POST** `/api/users/{userId}/image/upload`
    
    - _Description:_ Télécharge une image de profil pour un utilisateur staff.
        
    - _Permissions:_ `ADMIN`, ou l'utilisateur lui-même.
        
    - _Body (form-data):_ Clé `file`, Type `File`.
        

### 6. Gestion des Clients (`/api/customers`)

- **POST** `/api/customers`
    
    - _Description:_ Crée un nouveau client (utilisé par le staff).
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "fullName": "Client Créé Par Staff",
            "mail": "staff.created@client.com",
            "password": "Password123!",
            "phone": "0331234567",
            "address": "1 Rue Staff"
        }
        ```
        
- **GET** `/api/customers`
    
    - _Description:_ Récupère tous les clients.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/customers/{id}`
    
    - _Description:_ Récupère un client par ID.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le client lui-même (`CUSTOMER` avec son propre `id`).
        
- **GET** `/api/customers/segmentation`
    
    - _Description:_ Récupère les clients par critères de segmentation.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Paramètres de requête (optionnels):_ `hasPhone=true` ou `false`, `emailDomain=example.com`
        
    - _Exemples d'URLs:_
        
        - `/api/customers/segmentation?hasPhone=true`
            
        - `/api/customers/segmentation?emailDomain=gmail.com`
            
- **PUT** `/api/customers/{id}`
    
    - _Description:_ Met à jour un client.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le client lui-même (pour son propre profil).
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "fullName": "Client Mis à Jour",
            "mail": "new.mail@client.com",
            "phone": "0339876543",
            "address": "Nouvelle Adresse",
            "password": "UpdatedPassword123!"
        }
        ```
        
- **DELETE** `/api/customers/{id}`
    
    - _Description:_ Supprime un client.
        
    - _Permissions:_ `ADMIN`
        

### 7. Gestion des Chambres (Suite) (`/api/rooms`)

- **POST** `/api/rooms`
    
    - _Description:_ Crée une nouvelle chambre avec images multiples.
        
    - _Permissions:_ `ADMIN`
        
    - _Body (form-data):_
        
        - Clé `room` (Type `Application/JSON`):
            
            ```json
            {
                "roomNumber": "101",
                "title": "Chambre Standard",
                "description": "Une chambre confortable avec vue sur le jardin.",
                "roomType": "SINGLE",
                "capacity": { "adults": 1, "children": 0 },
                "sizeInSqMeters": 20,
                "floor": 1,
                "bedConfiguration": "1 Lit Simple",
                "viewType": "Jardin",
                "basePrice": 80.00,
                "weekendPrice": 95.00,
                "onSale": false,
                "amenities": ["WIFI", "TV"],
                "roomStatus": "AVAILABLE",
                "isPublished": true,
                "internalNotes": "Vérifier la télécommande."
            }
            ```
            
        - Clé `imageFiles` (Type `File`): Sélectionne 1 ou plusieurs fichiers.
            
- **PUT** `/api/rooms/{id}`
    
    - _Description:_ Met à jour une chambre (ajoute de nouvelles images, ne supprime pas les anciennes).
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (form-data):_
        
        - Clé `room` (Type `Application/JSON`):
            
            ```json
            {
                "roomNumber": "101",
                "title": "Chambre Standard Rénovée",
                "description": "Une chambre rénovée, toujours confortable.",
                "roomType": "SINGLE",
                "capacity": { "adults": 1, "children": 0 },
                "sizeInSqMeters": 20,
                "floor": 1,
                "bedConfiguration": "1 Lit Simple",
                "viewType": "Jardin",
                "basePrice": 85.00,
                "weekendPrice": 95.00,
                "onSale": true,
                "salePrice": 75.00,
                "amenities": ["WIFI", "TV", "Climatisation"],
                "roomStatus": "AVAILABLE",
                "isPublished": true,
                "internalNotes": "Rénovation terminée."
            }
            ```
            
        - Clé `newImageFiles` (Type `File`, optionnel): Sélectionne de nouveaux fichiers.
            
- **POST** `/api/rooms/{roomId}/images`
    
    - _Description:_ Ajoute de nouvelles images à la galerie d'une chambre.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (form-data):_ Clé `imageFiles` (Type `File`).
        
- **DELETE** `/api/rooms/{roomId}/images`
    
    - _Description:_ Supprime des images spécifiques de la galerie d'une chambre.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_
        
        ```json
        [
            "nom_fichier_image_1.jpg",
            "nom_fichier_image_2.png"
        ]
        ```
        
- **PUT** `/api/rooms/{roomId}/thumbnail`
    
    - _Description:_ Définit une image existante comme miniature de la chambre.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, Text):_
        
        ```json
        nom_unique_de_l_image_pour_la_miniature.jpg
        ```
        
    - _Note:_ L'URL doit déjà exister dans la `imageUrls` de la chambre.
        
- **DELETE** `/api/rooms/{id}`
    
    - _Description:_ Supprime une chambre.
        
    - _Permissions:_ `ADMIN`
        

### 8. Gestion de la Facturation (`/api/invoices`)

- **POST** `/api/invoices`
    
    - _Description:_ Crée une nouvelle facture.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "customerId": "ID_DU_CLIENT",
            "issueDate": "2025-08-15",
            "dueDate": "2025-09-15",
            "items": [
                { "description": "Nuitée Chambre 101", "quantity": 2, "unitPrice": 100.00 },
                { "description": "Petit-déjeuner", "quantity": 2, "unitPrice": 10.00 }
            ],
            "status": "PENDING",
            "notes": "Facture pour séjour de 2 nuits."
        }
        ```
        
- **GET** `/api/invoices`
    
    - _Description:_ Récupère toutes les factures.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/invoices/{id}`
    
    - _Description:_ Récupère une facture par ID.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le client lui-même (si la facture est liée à son `customerId`).
        
- **GET** `/api/invoices/by-customer/{customerId}`
    
    - _Description:_ Récupère les factures d'un client spécifique.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le client lui-même (si `customerId` correspond à son ID).
        
- **PUT** `/api/invoices/{id}`
    
    - _Description:_ Met à jour une facture. **DOIT inclure tous les champs obligatoires du DTO.**
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_ (Exemple avec des valeurs existantes + modifications)
        
        ```
        {
            "customerId": "ID_DU_CLIENT_EXISTANT_DE_LA_FACTURE",
            "issueDate": "2025-08-15",
            "dueDate": "2025-09-15",
            "totalAmount": 220.0,
            "paidAmount": 0.0,
            "balanceDue": 220.0,
            "status": "PENDING",
            "notes": "Facture mise à jour avec nouvelle note.",
            "items": [
                { "description": "Nuitée Chambre 101", "quantity": 2, "unitPrice": 100.00, "amount": 200.0 },
                { "description": "Petit-déjeuner", "quantity": 3, "unitPrice": 10.00, "amount": 30.0 }
            ]
        }
        ```
        
- **PATCH** `/api/invoices/{invoiceId}/status`
    
    - _Description:_ Met à jour le statut d'une facture.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, Text):_ `PAID` (ou `OVERDUE`, `CANCELLED`, `PENDING`)
        
- **DELETE** `/api/invoices/{id}`
    
    - _Description:_ Supprime une facture.
        
    - _Permissions:_ `ADMIN`
        

### 9. Gestion des Paiements (`/api/payments`)

- **POST** `/api/payments`
    
    - _Description:_ Enregistre un nouveau paiement pour une facture.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "invoiceId": "ID_DE_LA_FACTURE_EXISTANTE",
            "amount": 50.00,
            "paymentMethod": "CREDIT_CARD",
            "transactionId": "TXN_123456789",
            "notes": "Paiement partiel par carte"
        }
        ```
        
- **GET** `/api/payments`
    
    - _Description:_ Récupère tous les paiements.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/payments/{id}`
    
    - _Description:_ Récupère un paiement par ID.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le client si le paiement est lié à sa facture.
        
- **GET** `/api/payments/by-invoice/{invoiceId}`
    
    - _Description:_ Récupère tous les paiements d'une facture.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le client si la facture est liée à son ID.
        
- **DELETE** `/api/payments/{id}`
    
    - _Description:_ Supprime un paiement.
        
    - _Permissions:_ `ADMIN`
        

### 10. Gestion des Stocks (`/api/inventory`)

- **POST** `/api/inventory`
    
    - _Description:_ Crée un nouvel article en stock.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "name": "Shampooing",
            "description": "Shampooing de luxe pour salle de bain",
            "sku": "SHAMPOO-DELUXE-001-UNIQUE", // CHANGE SKU EACH TIME OR USE PUT FOR UPDATE
            "category": "TOILETRIES",
            "currentStock": 200,
            "minStockLevel": 50,
            "unitOfMeasure": "bouteille",
            "purchasePrice": 2.50
        }
        ```
        
- **GET** `/api/inventory`
    
    - _Description:_ Récupère tous les articles en stock.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/inventory/{id}`
    
    - _Description:_ Récupère un article par ID.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/inventory/category/{category}`
    
    - _Description:_ Récupère les articles d'une catégorie spécifique.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Exemple d'URL:_ `/api/inventory/category/MINIBAR`
        
- **GET** `/api/inventory/low-stock`
    
    - _Description:_ Récupère les articles dont le stock est faible.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **PUT** `/api/inventory/{id}`
    
    - _Description:_ Met à jour un article en stock.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "name": "Shampooing Standard",
            "description": "Shampooing standard pour salle de bain",
            "category": "TOILETRIES",
            "currentStock": 180,
            "minStockLevel": 40,
            "unitOfMeasure": "bouteille",
            "purchasePrice": 2.00
            // N'envoie que les champs que tu veux modifier (ceux-ci sont tous facultatifs dans le DTO de mise à jour)
        }
        ```
        
- **PATCH** `/api/inventory/{id}/adjust-stock?quantity={quantite}`
    
    - _Description:_ Ajuste le niveau de stock d'un article (quantité positive pour ajouter, négative pour retirer).
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Exemples d'URLs:_
        
        - `/api/inventory/ID_ARTICLE/adjust-stock?quantity=10` (ajouter 10)
            
        - `/api/inventory/ID_ARTICLE/adjust-stock?quantity=-5` (retirer 5)
            
- **DELETE** `/api/inventory/{id}`
    
    - _Description:_ Supprime un article en stock.
        
    - _Permissions:_ `ADMIN`
        

### 11. Gestion des Réservations (`/api/bookings`)

- **POST** `/api/bookings`
    
    - _Description:_ Crée une nouvelle réservation.
        
    - _Permissions:_ `ADMIN`, `EDITOR` (peut réserver pour n'importe quel client), ou `CUSTOMER` (peut réserver uniquement pour son propre `customerId`).
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "customerId": "ID_DU_CLIENT_AUTHENTIFIE", // Si CUSTOMER, cet ID doit correspondre à l'ID de ton token
            "roomId": "ID_DE_LA_CHAMBRE",
            "checkInDate": "2025-09-01",
            "checkOutDate": "2025-09-05",
            "numAdults": 2,
            "numChildren": 1,
            "notes": "Anniversaire de mariage"
        }
        ```
        
- **GET** `/api/bookings`
    
    - _Description:_ Récupère toutes les réservations.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **GET** `/api/bookings/{id}`
    
    - _Description:_ Récupère une réservation par ID.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le `CUSTOMER` si la réservation lui appartient.
        
- **GET** `/api/bookings/by-customer/{customerId}`
    
    - _Description:_ Récupère toutes les réservations d'un client spécifique.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le `CUSTOMER` s'il correspond à `customerId`.
        
- **GET** `/api/bookings/by-room/{roomId}`
    
    - _Description:_ Récupère toutes les réservations pour une chambre spécifique.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
- **PUT** `/api/bookings/{id}`
    
    - _Description:_ Met à jour une réservation.
        
    - _Permissions:_ `ADMIN`, `EDITOR`, ou le `CUSTOMER` si la réservation lui appartient (pour modifier certaines informations comme les notes ou le nombre d'adultes/enfants, mais pas la chambre ni les dates).
        
    - _Body (raw, JSON):_
        
        ```json
        {
            "customerId": "ID_DU_CLIENT_DE_LA_RESERVATION", // Doit exister et correspondre si CUSTOMER
            "roomId": "ID_DE_LA_CHAMBRE_DE_LA_RESERVATION", // Doit exister
            "checkInDate": "2025-09-01",
            "checkOutDate": "2025-09-05",
            "numAdults": 3,
            "numChildren": 0,
            "notes": "Demande de lit bébé supplémentaire mise à jour."
        }
        ```
        
- **PATCH** `/api/bookings/{id}/status`
    
    - _Description:_ Met à jour le statut d'une réservation.
        
    - _Permissions:_ `ADMIN`, `EDITOR`
        
    - _Body (raw, Text):_ `CONFIRMED` (ou `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`, `NO_SHOW`, `PENDING`).
        
- **DELETE** `/api/bookings/{id}`
    
    - _Description:_ Supprime une réservation.
        
    - _Permissions:_ `ADMIN`

---


