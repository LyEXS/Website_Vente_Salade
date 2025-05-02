// Fonction pour afficher les détails de la salade
// Fonction pour afficher les détails de la salade
function showDetails(saladeId) {
    console.log("Tentative d'affichage pour:", saladeId);

    try {
        // Trouver la carte de salade en utilisant l'ID
        const saladeCard = document.getElementById(`${saladeId}-details`);
        if (!saladeCard) {
            console.error("Carte de salade non trouvée");
            return;
        }

        // Récupérer l'image depuis la carte
        const imageDiv = saladeCard.closest('.salade-card').querySelector('.salade-image');
        const computedStyle = window.getComputedStyle(imageDiv);
        let imageUrl = computedStyle.backgroundImage;

        // Nettoyer l'URL
        imageUrl = imageUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        console.log("URL de l'image:", imageUrl);

        // Vérifier si l'URL est valide
        if (!imageUrl || imageUrl === 'none') {
            console.error("URL d'image invalide");
            imageUrl = 'https://via.placeholder.com/600x400?text=Image+non+disponible';
        }

        // Récupérer les autres éléments
        const saladeName = saladeCard.closest('.salade-card').querySelector('.salade-name').textContent;
        const details = saladeCard.innerHTML;

        // Créer le contenu de la modal
        document.getElementById('modal-content').innerHTML = `
            <div class="modal-image-container">
                <img src="${imageUrl}" alt="${saladeName}" class="modal-image" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400?text=Image+non+disponible';">
            </div>
            <div class="modal-text-content">
                <h2>${saladeName}</h2>
                ${details}
                <button onclick="closeSaladeModal()" class="btn-close">Fermer</button>
            </div>
        `;

        // Afficher la modal
        document.getElementById('salade-modal').style.display = 'block';
    } catch (error) {
        console.error("Erreur dans showDetails:", error);
    }
}


// Fonction pour fermer la modal des salades
function closeSaladeModal() {
    document.getElementById('salade-modal').style.display = 'none';
}

// Fonction pour ouvrir la modal de commande
function openOrderModal() {
    document.getElementById('orderModal').style.display = 'block';
}

// Fonction pour fermer la modal de commande
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Gestion des clics en dehors des modals
window.onclick = function(event) {
    if (event.target === document.getElementById('salade-modal')) {
        closeSaladeModal();
    }
    if (event.target === document.getElementById('orderModal')) {
        closeOrderModal();
    }
}

// Menu burger
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.createElement('div');
    burger.className = 'burger';
    burger.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.navbar').appendChild(burger);

    burger.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
});


function ajouterAuPanier(nomSalade) {
    // Récupérer le panier actuel depuis le localStorage
    let panier = JSON.parse(localStorage.getItem("panier")) || [];

    // Ajouter la salade au panier
    panier.push(nomSalade);

    // Sauvegarder le panier mis à jour
    localStorage.setItem("panier", JSON.stringify(panier));

    // Notification simple
    alert(nomSalade + " a été ajoutée au panier !");
}



function afficherPanier() {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    let liste = document.getElementById("listePanier");
    liste.innerHTML = "";

    if (panier.length === 0) {
        liste.innerHTML = "<li>Votre panier est vide.</li>";
    } else {
        panier.forEach((salade, index) => {
            const item = document.createElement("li");
            item.textContent = `${index + 1}. ${salade}`;
            liste.appendChild(item);
        });
    }

    document.getElementById("panierModal").style.display = "block";
}

// Événements pour ouvrir/fermer la modale
document.getElementById("voirPanierBtn").addEventListener("click", afficherPanier);
document.getElementById("fermerPanier").addEventListener("click", () => {
    document.getElementById("panierModal").style.display = "none";
});
window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("panierModal")) {
        document.getElementById("panierModal").style.display = "none";
    }
});




