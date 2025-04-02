# ChatApp - Application de messagerie instantanée


## Description
ChatApp est une application de messagerie instantanée moderne construite avec Nuxt 3, Vue.js, Firebase Realtime Database et MySQL. Elle permet aux utilisateurs de s'inscrire, se connecter, et échanger des messages en temps réel avec d'autres utilisateurs.

## Fonctionnalités

- **Authentification complète** : Inscription, connexion et gestion des sessions avec nuxt-auth-utils
- **Messagerie en temps réel** : Communication instantanée entre utilisateurs via Firebase Realtime Database
- **Gestion de profil** : Visualiser et modifier les informations personnelles, y compris la photo de profil via Cloudinary
- **Interface moderne** : UI élégante et responsive construite avec Tailwind CSS
- **Notifications** : Alertes et notifications avec vue-sonner
- **Gestion d'état** : Utilisation de Pinia pour la gestion d'état globale

## Technologies utilisées

### Frontend
- **Nuxt 3** : Framework Vue.js pour le SSR et le développement fullstack
- **Vue.js** : Bibliothèque JavaScript réactive
- **Tailwind CSS** : Framework CSS pour le design
- **Pinia** : Gestionnaire d'état moderne
- **Vue-sonner** : Système de notifications

### Backend
- **Nuxt Server** : API serverless via Nitro
- **MySQL** : Base de données relationnelle pour le stockage des utilisateurs et métadonnées
- **Firebase Realtime Database** : Stockage et synchronisation en temps réel des messages
- **Cloudinary** : Gestion des images et avatars
- **JWT** : Authentification sécurisée
- **bcrypt** : Hashage des mots de passe

## Prérequis

- Node.js (version recommandée: >=18.x)
- MySQL
- Compte Firebase avec Realtime Database activée
- Compte Cloudinary pour la gestion des images

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/votre-username/chatApp.git
cd chatApp
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
Créer un fichier `.env` à la racine du projet avec les variables suivantes:

```env
# Base de données
DB_HOST=localhost
DB_NAME=nom_de_votre_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_jwt

# API
API_URL=/api/

# Firebase
NUXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
NUXT_PUBLIC_FIREBASE_DATABASE_URL=votre_database_url

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

4. Initialiser la base de données MySQL
```sql
CREATE DATABASE chatapp;
USE chatapp;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Lancement en mode développement

```bash
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:3000`.

## Déploiement en production

1. Construire l'application
```bash
npm run build
```

2. Prévisualiser la version de production
```bash
npm run preview
```

3. Pour déployer sur un serveur, suivez la [documentation de déploiement Nuxt](https://nuxt.com/docs/getting-started/deployment)

## Structure du projet

- `components/` - Composants Vue réutilisables
  - `updateBox.vue` - Composant pour modifier les informations utilisateur
  - `detailBox.vue` - Composant pour afficher les détails de l'utilisateur
  - `messageBox.vue` - Composant principal de messagerie
  - `signUpForm.vue` - Formulaire d'inscription
- `pages/` - Routes de l'application
- `server/` - API et logique côté serveur
  - `api/` - Points de terminaison API
  - `database/` - Configuration de la base de données
- `stores/` - Magasins Pinia pour la gestion d'état
- `plugins/` - Plugins Nuxt
- `layouts/` - Mises en page partagées

## Fonctionnalités détaillées

### Messagerie en temps réel
Les messages sont synchronisés en temps réel grâce à Firebase Realtime Database. Chaque conversation est stockée avec un identifiant unique basé sur les identifiants des deux utilisateurs impliqués.

### Gestion de profil
Les utilisateurs peuvent modifier leur profil incluant:
- Nom d'utilisateur
- Email
- Description
- Mot de passe (avec vérification du mot de passe actuel)
- Avatar (via Cloudinary)

### Sécurité
- Mots de passe hashés avec bcrypt
- Authentification par sessions avec nuxt-auth-utils ( j'ai encore quelques probleme pour mettre en place un systeme de session, donc toutes les contributions qui pourrait m'aider à mieux mettre en place un système efficace de gestion sont les bienvenu !!! )
- Validation des données côté client et serveur

## Contribution
Les contributions sont les bienvenues! N'hésitez pas à:
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add some amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## Contact
TRAORE Koba - [@BaKabo_exe](https://x.com/Bakabo_exe) - traorekoba7@gmail.com

Lien du projet: [https://github.com/BaKabo77/chatApp](https://github.com/BaKabo77/chatApp)
