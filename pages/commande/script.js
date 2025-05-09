let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let currentBowl = 1;
const bowls = [{
    size: null,
    base: [], // Changé de null à array
    protein: [], // Changé de null à array
    vegetables: [],
    sauce: [],
    croutons: [], // Changé de null à array
    extras: [],
    drink:[]
}];

// Navigation
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
    
    // Mise à jour des indicateurs d'étape
    document.querySelectorAll('.step-indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    if (index === slides.length - 3) { // Si on arrive sur le panier
        updateCart();
    }
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        saveCurrentStep();
        showSlide(currentSlide + 1);
        updateCart();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function showCart() {
    saveCurrentStep(); // Sauvegarde les données actuelles
    updateCart();     // Met à jour l'affichage AVANT de changer de slide
    showSlide(slides.length - 3); // Affiche le panier
}

// Activer/désactiver le bouton Suivant
function enableNext(step) {
    const nextBtn = document.getElementById(`nextBtn${step}`);
    if (nextBtn) {
        let hasSelection = false;
        
        // Pour les étapes avec checkboxes (bases, protéines, etc.)
        if (step === 2 || step === 3 || step === 5) {
            hasSelection = document.querySelectorAll(`#step${step} input[type="checkbox"]:checked`).length > 0;
        } 
        // Pour les étapes avec radios
        else {
            hasSelection = document.querySelector(`#step${step} input[type="radio"]:checked`) !== null;
        }
        
        nextBtn.disabled = !hasSelection;
    }
}

// Gérer les sous-catégories de base
function setBase(value) {
    const mainRadio = document.querySelector(`input[name="base"][value="${value.split('_')[0] + '_' + value.split('_')[1]}"]`);
    if (mainRadio) {
        mainRadio.checked = true;
        enableNext(2);
        bowls[currentBowl - 1].base = value;
        updateLivePrice();
    }
}

// Sauvegarde des choix
function saveCurrentStep() {
    const bowl = bowls[currentBowl - 1];
    
    if (currentSlide === 1) {
        bowl.size = document.querySelector('input[name="size"]:checked')?.value;
    }
    else if (currentSlide === 2) {
        bowl.base = [];
        document.querySelectorAll('input[name="base"]:checked').forEach(el => {
            bowl.base.push(el.value);
        });
    }
    else if (currentSlide === 3) {
        bowl.protein = [];
        document.querySelectorAll('input[name="protein"]:checked').forEach(el => {
            bowl.protein.push(el.value);
        });
    }
    else if (currentSlide === 4) {
        bowl.vegetables = [];
        document.querySelectorAll('input[name="vegetables"]:checked').forEach(el => {
            bowl.vegetables.push(el.value);
        });
    }
    else if (currentSlide === 5) {
        bowl.sauce = [];
        document.querySelectorAll('input[name="sauce"]:checked').forEach(el => {
            bowl.sauce.push(el.value);
        });
    }
    else if (currentSlide === 6) {
        bowl.extras = [];
        document.querySelectorAll('input[name="extras"]:checked').forEach(el => {
            bowl.extras.push(el.value);
        });
    }
    else if (currentSlide === 7) { // Si c'est la slide des croutons
        bowl.croutons = [];
        document.querySelectorAll('input[name="croutons"]:checked').forEach(el => {
            bowl.croutons.push(el.value);
        });
    }
    else if (currentSlide === 8) {
        bowl.drink = []; // Réinitialise le tableau
        document.querySelectorAll('input[name="drink"]:checked').forEach(el => {
            bowl.drink.push(el.value);
        });
    }
    updateLivePrice();
    updateTicket();
}

// Calcul du prix total
function calculateTotalPrice() {
    let total = 0;
    
    bowls.forEach(bowl => {
        // Taille
        if (bowl.size) {
            total += getPrice('size', bowl.size);
        }

        // Base
        bowl.base.forEach(base => {
            total += getPrice('base', base);
        });

        // Protéines
        bowl.protein.forEach(prot => {
            total += getPrice('protein', prot);
        });

        // Légumes & garnitures
        bowl.vegetables.forEach(veg => {
            total += getPrice('vegetables', veg);
        });

        // Sauces
        bowl.sauce.forEach(sauce => {
            total += getPrice('sauce', sauce);
        });

        // Suppléments
        bowl.extras.forEach(extra => {
            total += getPrice('extras', extra);
        });

        // Croutons
        bowl.croutons.forEach(crouton => {
            total += getPrice('croutons', crouton);
        });

        // Boissons
        bowl.drink.forEach(drink => {
            total += getPrice('drink', drink);
        });
    });

    return total;
}

// Affichage dynamique du prix
function updateLivePrice() {
    const total = calculateTotalPrice();
    document.getElementById('livePrice').textContent = total + ' DZD';
}

// Mise à jour du panier
function updateCart() {
    const cartEl = document.getElementById('cart');
    if (!cartEl) return;
    
    cartEl.innerHTML = '';
    
    if (bowls.length === 0 || bowls.every(bowl => isBowlEmpty(bowl))) {
        cartEl.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        document.getElementById('cartTotal').textContent = '0';
        return;
    }
    
    bowls.forEach((bowl, index) => {
        if (isBowlEmpty(bowl)) return;
        
        const bowlHeader = document.createElement('h3');
        bowlHeader.textContent = `Bol ${index + 1}`;
        bowlHeader.style.marginTop = '15px';
        bowlHeader.style.color = '#2e8b57';
        cartEl.appendChild(bowlHeader);
        
        // Afficher chaque catégorie
        if (bowl.size) {
            addCartItem('Taille', getLabel('size', bowl.size), getPrice('size', bowl.size), index, bowl.size);
        }
        
        if (bowl.base.length > 0) {
            bowl.base.forEach(base => {
                addCartItem('Base', getLabel('base', base), getPrice('base', base), index, base);
            });
        }
        
        if (bowl.protein.length > 0) {
            bowl.protein.forEach(prot => {
                addCartItem('Protéine', getLabel('protein', prot), getPrice('protein', prot), index, prot);
            });
        }
        
        if (bowl.vegetables.length > 0) {
            bowl.vegetables.forEach(veg => {
                addCartItem('Garniture', getLabel('vegetables', veg), getPrice('vegetables', veg), index, veg);
            });
        }
        
        if (bowl.sauce.length > 0) {
            bowl.sauce.forEach(s => {
                addCartItem('Sauce', getLabel('sauce', s), getPrice('sauce', s), index, s);
            });
        }
        
        if (bowl.extras.length > 0) {
            bowl.extras.forEach(extra => {
                addCartItem('Supplément', getLabel('extras', extra), getPrice('extras', extra), index, extra);
            });
        }

        if (bowl.croutons.length > 0) {
            bowl.croutons.forEach(crouton => {
                addCartItem('Croutons', getLabel('croutons', crouton), getPrice('croutons', crouton), index, crouton);
            });
        }
        
        if (bowl.drink.length > 0) {
            bowl.drink.forEach(d => {
                addCartItem('Boisson', getLabel('drink', d), getPrice('drink', d), index, d);
            });
        }
    });
    
    document.getElementById('cartTotal').textContent = calculateTotalPrice() + ' DZD';
}

function addCartItem(category, name, price, bowlIndex, value) {
    const cartEl = document.getElementById('cart');
    // Crée un ID unique avec la valeur originale (pas le label)
    const itemId = `bowl-${bowlIndex}-${category.toLowerCase()}-${value.replace(/\s+/g, '-')}`;
    
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.id = itemId;
    itemEl.innerHTML = `
        <div>
            <strong>${category}:</strong> ${name}
        </div>
        <div class="cart-item-controls">
            <span>${price} DZD</span>
            <button class="secondary" onclick="removeCartItem(${bowlIndex}, '${category}', '${value}')">-</button>
        </div>
    `;
    cartEl.appendChild(itemEl);
}

function removeCartItem(bowlIndex, category, value) {
    const bowl = bowls[bowlIndex];
    
    if (category === 'Taille') {
        bowl.size = null;
    }
    else if (category === 'Base') {
        const index = bowl.base.indexOf(value);
        if (index > -1) bowl.base.splice(index, 1);
    }
    else if (category === 'Protéine') {
        const index = bowl.protein.indexOf(value);
        if (index > -1) bowl.protein.splice(index, 1);
    }
    else if (category === 'Garniture') {
        const index = bowl.vegetables.indexOf(value);
        if (index > -1) bowl.vegetables.splice(index, 1);
    }
    else if (category === 'Sauce') {
        const index = bowl.sauce.indexOf(value);
        if (index > -1) bowl.sauce.splice(index, 1);
    }
    else if (category === 'Supplément') {
        const index = bowl.extras.indexOf(value);
        if (index > -1) bowl.extras.splice(index, 1);
    }
    else if (category === 'Croutons') {
        const index = bowl.croutons.indexOf(value);
        if (index > -1) bowl.croutons.splice(index, 1);
    }
    else if (category === 'Boisson') {
        const index = bowl.drink.indexOf(value);
        if (index > -1) bowl.drink.splice(index, 1);
    }
    
    // Si le bol est vide, on le supprime
    if (isBowlEmpty(bowl)) {
        bowls.splice(bowlIndex, 1);
        currentBowl--;
    }
    
    updateCart();
    updateTicket();
    updateLivePrice();
}

function isBowlEmpty(bowl) {
    return !bowl.size && 
           bowl.base.length === 0 && 
           bowl.protein.length === 0 && 
           bowl.vegetables.length === 0 && 
           bowl.sauce.length === 0 && 
           bowl.extras.length === 0 && 
           bowl.croutons.length === 0 && 
           bowl.drink.length===0;
}
// Ajout d'un nouveau bol
function addAnotherBowl() {
    bowls.push({
        size: null,
        base: [], // Initialisé comme tableau vide
        protein: [], // Initialisé comme tableau vide
        vegetables: [],
        sauce: [], // Initialisé comme tableau vide
        extras: [],
        drink: []
    });
    currentBowl = bowls.length;
    
    // Réinitialiser les sélections
    document.querySelectorAll('input').forEach(input => {
        input.checked = false;
    });
    updateTicket();
    
    // Retourner à la première étape
    showSlide(1);
    enableNext(1);
    enableNext(2);

}

function getLabel(type, value) {
    const labels = {
        size: {
            'S': 'Small (S)',
            'L': 'Large (L)',
            'XL': 'XL',
            'XXL': 'XXL'
        },
        base: {
            'salade_laitue': 'Salade (laitue)',
            'salade_roquette': 'Salade (roquette)',
            'salade_epinards': 'Salade (épinards)',
            'salade_mesclun': 'Salade (mesclun)',
            'riz_blanc': 'Riz blanc',
            'riz_complet': 'Riz complet',
            'riz_basmati': 'Riz basmati',
            'riz_sauvage': 'Riz sauvage',
            'pates_penne': 'Pâtes (penne)',
            'pates_fusilli': 'Pâtes (fusilli)',
            'pates_farfalle': 'Pâtes (farfalle)',
            'pates_orecchiette': 'Pâtes (orecchiette)',
            'quinoa': 'Quinoa',
            'boulgour': 'Boulgour',
            'lentilles': 'Lentilles',
            'couscous': 'Couscous perlé'
        },
        protein: {
            'poulet_grille': 'Poulet grillé',
            'poulet_crispy': 'Poulet crispy',
            'boeuf': 'Bœuf mariné',
            'saumon': 'Saumon fumé',
            'crevettes': 'Crevettes',
            'tofu': 'Tofu',
            'falafel': 'Falafel',
            'oeufs': 'Œufs durs'
        },
        vegetables: {
            'avocat': 'Avocat',
            'concombre': 'Concombre',
            'tomates': 'Tomates cerises',
            'poivrons': 'Poivrons',
            'champignons': 'Champignons',
            'betterave': 'Betterave',
            'radis': 'Radis',
            'carottes': 'Carottes râpées',
            'olives_noires': 'Olives noires',
            'olives_vertes': 'Olives vertes',
            'cornichons': 'Cornichons',
            'mais': 'Maïs',
            'oignons': 'Oignons rouges',
            'edamame': 'Edamame',
            'pommes': 'Pommes',
            'raisins': 'Raisins secs',
            'noix': 'Noix',
            'fromage_rape': 'Fromage râpé',
            'feta': 'Feta',
            'mozzarella': 'Mozzarella',
            'parmesan': 'Parmesan'
        },
        sauce: {
            'mayonnaise': 'Mayonnaise',
            'ketchup': 'Ketchup',
            'moutarde': 'Moutarde',
            'algerienne': 'Sauce algérienne',
            'barbecue': 'Sauce barbecue',
            'pesto': 'Pesto',
            'fromagere': 'Sauce fromagère',
            'yaourt_citron': 'Sauce yaourt-citron',
            'cesar': 'Sauce césar',
            'balsamique': 'Vinaigrette balsamique',
            'miel_moutarde': 'Sauce miel-moutarde',
            'sesame': 'Sauce sésame',
            'ranch': 'Sauce ranch'
        },
        extras: {
            'graines_sesame': 'Graines de sésame',
            'graines_chia': 'Graines de chia',
            'graines_tournesol': 'Graines de tournesol',
            'graines_courge': 'Graines de courge',
            'lin': 'Lin',
            'pavot': 'Pavot',
            'noix_concasees': 'Noix concassées',
            'amandes_effilees': 'Amandes effilées',
            'noix_cajou': 'Noix de cajou',
            'cranberries_sechees': 'Cranberries séchées'
        },
        croutons: {
            'nature': 'Croutons nature',
            'ail': 'Croutons à l\'ail',
            'herbes': 'Croutons aux herbes',
            'epices': 'Croutons épicés'
        },
        drink: {
            'smoothie_banane': 'Smoothie banane',
            'smoothie_fraise': 'Smoothie fraise',
            'smoothie_mangue': 'Smoothie mangue',
            'smoothie_fruits_rouges': 'Smoothie fruits rouges',
            'smoothie_ananas_coco': 'Smoothie ananas-coco',
            'smoothie_exotique': 'Smoothie cocktail exotique',
            'jus_orange': 'Jus d\'orange pressé',
            'jus_citronnade': 'Citronnade',
            'jus_pomme_gingembre': 'Jus pomme-gingembre',
            'jus_carotte_orange': 'Jus carotte-orange',
            'eau_plate': 'Eau plate',
            'eau_petillante': 'Eau pétillante',
            'soda': 'Soda',
            'the_glace': 'Thé glacé maison'
        }
    };
    return labels[type][value] || value;
}

function getPrice(type, value) {
    const prices = {
        size: {
            'S': 5,
            'L': 7,
            'XL': 9,
            'XXL': 12
        },
        base: {
            'salade_laitue': 18,
            'salade_roquette': 18,
            'salade_epinards': 18,
            'salade_mesclun': 18,
            'riz_blanc': 30,
            'riz_complet': 30,
            'riz_basmati': 30,
            'riz_sauvage': 30,
            'pates_penne': 22,
            'pates_fusilli': 22,
            'pates_farfalle': 22,
            'pates_orecchiette': 22,
            'quinoa': 120,
            'boulgour': 45,
            'lentilles': 37,
            'couscous': 52
        },
        protein: {
            'poulet_grille': 90,
            'poulet_crispy': 90,
            'boeuf': 210,
            'saumon': 300,
            'crevettes': 300,
            'tofu': 180,
            'falafel': 100,
            'oeufs': 15
        },
        vegetables: {
            'avocat': 120,
            'concombre': 8,
            'tomates': 30,
            'poivrons': 8,
            'champignons': 50,
            'betterave': 8,
            'radis': 25,
            'carottes': 6,
            'olives_noires': 15,
            'olives_vertes': 15,
            'cornichons': 20,
            'mais': 20,
            'oignons': 5,
            'edamame': 20,
            'pommes': 40,
            'raisins': 40,
            'noix': 75,
            'fromage_rape': 75,
            'feta': 100,
            'mozzarella': 110,
            'parmesan': 125
        },
        sauce: {
            'mayonnaise': 15,
            'ketchup': 15,
            'moutarde': 15,
            'algerienne': 20,
            'barbecue': 20,
            'pesto': 25,
            'fromagere': 25,
            'yaourt_citron': 20,
            'cesar': 25,
            'balsamique': 20,
            'miel_moutarde': 25,
            'sesame': 25,
            'ranch': 25
        },
        extras: {
            'graines_sesame': 5,
            'graines_chia': 5,
            'graines_tournesol': 5,
            'graines_courge': 5,
            'lin': 5,
            'pavot': 5,
            'noix_concasees': 5,
            'amandes_effilees': 5,
            'noix_cajou': 5,
            'cranberries_sechees': 5
        },
        croutons: {
            'nature': 25,
            'ail': 25,
            'herbes': 25,
            'epices': 25
        },
        drink: {
            'smoothie_banane': 250,
            'smoothie_fraise': 250,
            'smoothie_mangue': 300,
            'smoothie_fruits_rouges': 300,
            'smoothie_ananas_coco': 350,
            'smoothie_exotique': 350,
            'jus_orange': 200,
            'jus_citronnade': 200,
            'jus_pomme_gingembre': 250,
            'jus_carotte_orange': 250,
            'eau_plate': 25,
            'eau_petillante': 30,
            'soda': 60,
            'the_glace': 60
        }
    };
    return prices[type][value] || 0;
}

// Confirmation de commande
function confirmOrder() {
    const total = calculateTotalPrice();
    // Sauvegarder le total dans le localStorage
    localStorage.setItem('orderTotal', total);
    // OU passer dans l'URL
    window.location.href = `../payment/index.html?total=${total}`;
}

function showCart() {
    saveCurrentStep();
    updateCart();
    
    // Ajoutez un bouton de paiement dans le panier
    const cartEl = document.getElementById('cart');
    if (cartEl) {
        const total = calculateTotalPrice();
        const paymentBtn = document.createElement('button');
        paymentBtn.textContent = `Payer ${total} DA`;
        paymentBtn.className = 'payment-btn';
        paymentBtn.onclick = function() {
            window.location.href = `paiement.html?total=${total}`;
        };
        cartEl.appendChild(paymentBtn);
    }
    
    showSlide(slides.length - 3); // Affiche le panier
}


// Réinitialisation
function resetOrder() {
    // Désélectionner tous les inputs
    document.querySelectorAll('input').forEach(input => {
        input.checked = false;
    });
    
    // Réinitialiser les données
    bowls.length = 1;
    currentBowl = 1;
    bowls[0] = {
        size: null,
        base: null,
        protein: null,
        vegetables: [],
        sauce: null,
        extras: [],
        drink: []
    };
    
    // Réinitialiser l'affichage
    showSlide(0);
    updateLivePrice();
    updateTicket();
    
    // Réactiver les boutons Suivant
    enableNext(1);
    enableNext(2);
}

// Écouteurs pour mise à jour en temps réel
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
        saveCurrentStep();
        updateLivePrice();
    });
});

function updateTicket() {
    const ticketItemsEl = document.getElementById('ticketItems');
    const ticketTotalEl = document.getElementById('ticketTotal');
    
    // Vider le ticket
    ticketItemsEl.innerHTML = '';
    
    // Parcourir tous les bols
    bowls.forEach((bowl, bowlIndex) => {
        if (isBowlEmpty(bowl)) return;
        
        // Ajouter un en-tête pour le bol
        const bowlHeader = document.createElement('div');
        bowlHeader.className = 'ticket-item';
        bowlHeader.innerHTML = `<strong>Bol ${bowlIndex + 1}</strong>`;
        ticketItemsEl.appendChild(bowlHeader);
        
        // Ajouter la taille
        if (bowl.size) {
            addTicketItem(`Taille: ${getLabel('size', bowl.size)}`, getPrice('size', bowl.size));
        }
        
        // Ajouter les bases
        bowl.base.forEach(base => {
            addTicketItem(getLabel('base', base), getPrice('base', base));
        });
        
        // Ajouter les protéines
        bowl.protein.forEach(prot => {
            addTicketItem(getLabel('protein', prot), getPrice('protein', prot));
        });
        
        // Ajouter les légumes
        bowl.vegetables.forEach(veg => {
            addTicketItem(getLabel('vegetables', veg), getPrice('vegetables', veg));
        });
        
        // Ajouter les sauces
        bowl.sauce.forEach(s => {
            addTicketItem(getLabel('sauce', s), getPrice('sauce', s));
        });
        
        // Ajouter les extras
        bowl.extras.forEach(extra => {
            addTicketItem(getLabel('extras', extra), getPrice('extras', extra));
        });

        // Ajouter les croutons
        bowl.croutons.forEach(c => {
            addTicketItem(getLabel('croutons', c), getPrice('croutons', c));
        });

        
        
        // Ajouter les boissons
        bowl.drink.forEach(d => {
            addTicketItem(getLabel('drink', d), getPrice('drink', d));
        });
    });
    
    // Mettre à jour le total
    ticketTotalEl.textContent = calculateTotalPrice() + '  DZD';
}

function addTicketItem(name, price) {
    const ticketItemsEl = document.getElementById('ticketItems');
    const itemEl = document.createElement('div');
    itemEl.className = 'ticket-item';
    itemEl.innerHTML = `
        <span>${name}</span>
        <span>${price}  DZD</span>
    `;
    ticketItemsEl.appendChild(itemEl);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Désélectionner explicitement tous les inputs
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.checked = false;
        input.removeAttribute('checked'); // Supprime l'attribut checked s'il existe
    });
    
    showSlide(0);
    document.getElementById('nextBtn1').disabled = true;
    document.getElementById('nextBtn2').disabled = true;
    updateTicket();
});