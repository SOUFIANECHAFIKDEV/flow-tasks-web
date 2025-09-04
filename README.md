# 🌐 Flow Tasks Web (Frontend)

Frontend de l’application **Flow Tasks** — un gestionnaire de tâches responsive développé avec **Angular 20** et **Angular Material**.

![App Screenshot](assets/screenshot.png)
---

## 🚀 Fonctionnalités
- ✅ Composants standalone Angular + signals
- ✅ Liste des tâches avec pagination et tri
- ✅ Recherche et filtrage par **titre, statut et assigné à**
- ✅ Ajout d’une tâche via une boîte de dialogue (modal)
- ✅ Mise à jour du statut avec fenêtre de confirmation
- ✅ Suppression avec fenêtre de confirmation
- ✅ Notifications snackbar (succès / info / erreur)
- ✅ Mise en page responsive (bureau & mobile)
- ✅ Thème personnalisé Angular Material

---

## 🛠️ Stack Technique
- **Framework** : Angular 20  
- **UI** : Angular Material  
- **État** : Angular Signals  
- **HTTP** : Angular HttpClient + interceptors  
- **Outils Dev** : Vite (serveur de dev), SCSS  

---

## ▶️ Lancer le projet en local

### Prérequis
- [Node.js](https://nodejs.org/) (>= 18)  
- [Angular CLI](https://angular.dev/tools/cli) (>= 20)  

### Étapes
# Installer les dépendances
npm install

# Lancer le serveur de dev
ng serve -o
➡️ L’application est disponible sur : http://localhost:4200

### ⚠️ Assurez-vous que l’API backend tourne sur : https://localhost:7121

### 📂 Composants Principaux
TasksPageComponent – Page principale (pagination, filtres, actions)

TaskFormComponent – Formulaire d’ajout de tâches

TaskListComponent – Tableau affichant les tâches

AddTaskDialogComponent – Modal pour ajouter une tâche

UpdateStatusDialogComponent – Modal pour mettre à jour un statut

ConfirmDialogComponent – Fenêtre de confirmation réutilisable

### 🎨 Thème
Couleur primaire : #043333

Couleur secondaire : #ffb4a7

Définies dans src/styles.scss

