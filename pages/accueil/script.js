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
                <button onclick="ajouterAuPanier('${saladeName}')" class="btn-ajouter-panier">Ajouter au panier</button>
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
    closeSaladeModal();
}



function afficherPanier() {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    let liste = document.getElementById("listePanier");
    liste.innerHTML = "";

    let totalPrice = 0; // Initialize total price

    if (panier.length === 0) {
        liste.innerHTML = "<li class='empty-panier'>Votre panier est vide.</li>";
    } else {
        panier.forEach((salade, index) => {
            const item = document.createElement("li");
            item.className = "panier-item";

            const itemText = document.createElement("span");
            // Get the price of the salad
            const price = getSaladPrice(salade);
            totalPrice += price; // Add to total price
            itemText.textContent = `${index + 1}. ${salade} - ${price} DZD`; // Display price
            itemText.className = "panier-item-text";

            const removeButton = document.createElement("button");
            removeButton.textContent = "Supprimer";
            removeButton.className = "btn-remove";
            removeButton.onclick = () => {
                panier.splice(index, 1);
                localStorage.setItem("panier", JSON.stringify(panier));
                afficherPanier();
            };

            item.appendChild(itemText);
            item.appendChild(removeButton);
            liste.appendChild(item);
        });
    }

    // Display total price
    const modalFooter = document.querySelector("#panierModal .modal-footer");
    modalFooter.innerHTML = `<div class="total-price">Total: ${totalPrice} DZD</div><button id="commanderBtn" class="passer-commande">Commander maintenant</button>`;

    document.getElementById("panierModal").style.display = "block";

    // Add event listener to the "Commander maintenant" button
    document.getElementById("commanderBtn").addEventListener("click", () => {
        // Redirect to the payment page with the total price
        window.location.href = `../payment/index.html?total=${totalPrice}`;
    });
}

// Function to get the price of a salad
function getSaladPrice(saladName) {
    const prices = {
        "Salade Fraîcheur": 120,
        "Salade Protéinée": 250,
        "Salade Méditerranéenne": 180,
        "Salade Nordique": 300,
        "Salade César revisitée": 200,
        "Salade Exotique": 280,
        "Salade Végétarienne Gourmande": 230,
        "Salade Italienne": 190,
        "Salade Détox": 150,
        "Salade Énergisante": 270,
        "Salade des Pâtes": 170,
        "Salade Algérienne": 160,
        "Macédoine": 150
    };
    return prices[saladName] || 0; // Return 0 if price not found
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




