let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let currentBowl = 1;
const bowls = [{
    size: null,
    base: null,
    protein: null,
    vegetables: [],
    sauce: null,
    extras: [],
    drink: null
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
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function showCart() {
    saveCurrentStep();
    showSlide(slides.length - 3); // Avant-dernier slide = panier
}

// Activer/désactiver le bouton Suivant
function enableNext(step) {
    const nextBtn = document.getElementById(`nextBtn${step}`);
    if (nextBtn) {
        const hasSelection = document.querySelector(`#step${step} input[type="radio"]:checked`);
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
    if (currentSlide === 1) {
        bowls[currentBowl - 1].size = document.querySelector('input[name="size"]:checked')?.value;
    }
    else if (currentSlide === 2) {
        // La base est déjà sauvegardée via setBase()
    }
    else if (currentSlide === 3) {
        bowls[currentBowl - 1].protein = [];
        document.querySelectorAll('input[name="protein"]:checked').forEach(el => {
            bowls[currentBowl - 1].protein.push(el.value);
        });
    }
    else if (currentSlide === 4) {
        bowls[currentBowl - 1].vegetables = [];
        document.querySelectorAll('input[name="vegetables"]:checked').forEach(el => {
            bowls[currentBowl - 1].vegetables.push(el.value);
        });
    }
    else if (currentSlide === 5) {
        bowls[currentBowl - 1].sauce = document.querySelector('input[name="sauce"]:checked')?.value;
    }
    else if (currentSlide === 6) {
        bowls[currentBowl - 1].extras = [];
        document.querySelectorAll('input[name="extras"]:checked').forEach(el => {
            bowls[currentBowl - 1].extras.push(el.value);
        });
    }
    else if (currentSlide === 7) {
        bowls[currentBowl - 1].drink = document.querySelector('input[name="drink"]:checked')?.value;
    }
    updateLivePrice();
}

// Calcul du prix total
function calculateTotalPrice() {
    let total = 0;
    
    bowls.forEach(bowl => {
        // Taille
        if (bowl.size === 'S') total += 5;
        else if (bowl.size === 'L') total += 7;
        else if (bowl.size === 'XL') total += 9;
        else if (bowl.size === 'XXL') total += 12;

        // Base
        if (['salade_laitue', 'salade_roquette', 'salade_epinards', 'salade_mesclun'].includes(bowl.base)) total += 1;
        else if (bowl.base === 'riz_blanc') total += 1;
        else if (['riz_complet', 'riz_basmati'].includes(bowl.base)) total += 1.5;
        else if (bowl.base === 'riz_sauvage') total += 2;
        else if (['pates_penne', 'pates_fusilli', 'pates_farfalle', 'pates_orecchiette'].includes(bowl.base)) total += 1.5;
        else if (bowl.base === 'quinoa') total += 2;
        else if (['boulgour', 'lentilles', 'couscous'].includes(bowl.base)) total += 1.5;

        // Protéines
        if (bowl.protein === 'poulet_grille') total += 3;
        else if (bowl.protein === 'poulet_crispy') total += 3.5;
        else if (bowl.protein === 'boeuf') total += 4;
        else if (bowl.protein === 'saumon') total += 5;
        else if (bowl.protein === 'crevettes') total += 4.5;
        else if (bowl.protein === 'tofu') total += 2.5;
        else if (bowl.protein === 'falafel') total += 3;
        else if (bowl.protein === 'oeufs') total += 2;

        // Légumes & garnitures
        bowl.vegetables.forEach(veg => {
            if (veg === 'avocat') total += 1.5;
            else if (veg === 'concombre' || veg === 'tomates' || veg === 'poivrons' || veg === 'radis' || 
                     veg === 'carottes' || veg === 'cornichons' || veg === 'mais' || veg === 'oignons') total += 0.5;
            else if (veg === 'champignons' || veg === 'betterave' || veg === 'olives_noires' || 
                     veg === 'olives_vertes' || veg === 'pommes' || veg === 'raisins') total += 0.8;
            else if (veg === 'edamame') total += 1;
            else if (veg === 'noix' || veg === 'fromage_rape') total += 1.2;
            else if (veg === 'feta' || veg === 'mozzarella' || veg === 'parmesan') total += 1.5;
        });

        // Sauces
        if (bowl.sauce === 'mayonnaise' || bowl.sauce === 'ketchup' || bowl.sauce === 'moutarde') total += 0.5;
        else if (bowl.sauce === 'algerienne' || bowl.sauce === 'barbecue') total += 0.8;
        else if (bowl.sauce === 'yaourt_citron' || bowl.sauce === 'balsamique') total += 0.8;
        else if (bowl.sauce === 'pesto' || bowl.sauce === 'cesar' || bowl.sauce === 'miel_moutarde' || bowl.sauce === 'ranch') total += 1;
        else if (bowl.sauce === 'fromagere' || bowl.sauce === 'sesame') total += 1.2;

        // Suppléments
        bowl.extras.forEach(extra => {
            if (extra.startsWith('graines_') || extra === 'lin' || extra === 'pavot') total += 0.8;
            else if (extra.endsWith('_sechees') || extra.endsWith('_effilees') || extra.endsWith('_concasees') || extra === 'noix_cajou') total += 1.2;
        });

        // Boissons
        if (bowl.drink) {
            if (bowl.drink.startsWith('smoothie')) total += 3;
            else if (bowl.drink.startsWith('jus')) total += 2.5;
            else if (bowl.drink.startsWith('eau') || bowl.drink.startsWith('soda') || bowl.drink.startsWith('the_glace')) total += 1.5;
        }
    });

    return total;
}

// Affichage dynamique du prix
function updateLivePrice() {
    const total = calculateTotalPrice();
    document.getElementById('livePrice').textContent = total + '€';
}

// Mise à jour du panier
function updateCart() {
    const cartEl = document.getElementById('cart');
    if (!cartEl) return;
    
    cartEl.innerHTML = '';
    
    // Ajout des éléments au panier
    bowls.forEach((bowl, index) => {
        const bowlHeader = document.createElement('h3');
        bowlHeader.textContent = `Bol ${index + 1}`;
        bowlHeader.style.marginTop = '15px';
        bowlHeader.style.color = '#2e8b57';
        cartEl.appendChild(bowlHeader);
        
        if (bowl.size) {
            addCartItem('Taille', getLabel('size', bowl.size), getPrice('size', bowl.size), index);
        }
        if (bowl.base) {
            addCartItem('Base', getLabel('base', bowl.base), getPrice('base', bowl.base), index);
        }
        if (bowl.protein) {
            addCartItem('Protéine', getLabel('protein', bowl.protein), getPrice('protein', bowl.protein), index);
        }
        
        bowl.vegetables.forEach(veg => {
            addCartItem('Garniture', getLabel('vegetables', veg), getPrice('vegetables', veg), index);
        });
        
        if (bowl.sauce) {
            addCartItem('Sauce', getLabel('sauce', bowl.sauce), getPrice('sauce', bowl.sauce), index);
        }
        
        bowl.extras.forEach(extra => {
            addCartItem('Supplément', getLabel('extras', extra), getPrice('extras', extra), index);
        });
        
        if (bowl.drink) {
            addCartItem('Boisson', getLabel('drink', bowl.drink), getPrice('drink', bowl.drink), index);
        }
    });
    
    document.getElementById('cartTotal').textContent = calculateTotalPrice();
}

function addCartItem(category, name, price, bowlIndex) {
    const cartEl = document.getElementById('cart');
    const itemId = `bowl-${bowlIndex}-${category}-${name.replace(/\s+/g, '-')}`;
    
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.id = itemId;
    itemEl.innerHTML = `
        <div>
            <strong>${category}:</strong> ${name}
        </div>
        <div class="cart-item-controls">
            <span>${price}€</span>
            <button class="secondary" onclick="removeCartItem('${itemId}', '${category}', '${name}', ${bowlIndex})">-</button>
        </div>
    `;
    cartEl.appendChild(itemEl);
}

function removeCartItem(itemId, category, name, bowlIndex) {
    const value = name.split(' (')[0].toLowerCase().replace(/\s+/g, '_');
    const bowl = bowls[bowlIndex];
    
    if (category === 'Taille') {
        bowl.size = null;
    }
    else if (category === 'Base') {
        bowl.base = null;
    }
    else if (category === 'Protéine') {
        bowl.protein = null;
    }
    else if (category === 'Garniture') {
        const index = bowl.vegetables.indexOf(value);
        if (index > -1) {
            bowl.vegetables.splice(index, 1);
        }
    }
    else if (category === 'Sauce') {
        bowl.sauce = null;
    }
    else if (category === 'Supplément') {
        const index = bowl.extras.indexOf(value);
        if (index > -1) {
            bowl.extras.splice(index, 1);
        }
    }
    else if (category === 'Boisson') {
        bowl.drink = null;
    }
    
    // Si le bol est vide, on le supprime
    if (isBowlEmpty(bowl)) {
        bowls.splice(bowlIndex, 1);
        currentBowl--;
    }
    
    updateCart();
    updateLivePrice();
}

function isBowlEmpty(bowl) {
    return !bowl.size && !bowl.base && !bowl.protein && bowl.vegetables.length === 0 && 
           !bowl.sauce && bowl.extras.length === 0 && !bowl.drink;
}

// Ajout d'un nouveau bol
function addAnotherBowl() {
    bowls.push({
        size: null,
        base: null,
        protein: null,
        vegetables: [],
        sauce: null,
        extras: [],
        drink: null
    });
    currentBowl = bowls.length;
    
    // Réinitialiser les sélections
    document.querySelectorAll('input').forEach(input => {
        input.checked = false;
    });
    
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
            'salade_laitue': 0,
            'salade_roquette': 0,
            'salade_epinards': 0,
            'salade_mesclun': 0,
            'riz_blanc': 1,
            'riz_complet': 1.5,
            'riz_basmati': 1.5,
            'riz_sauvage': 2,
            'pates_penne': 0,
            'pates_fusilli': 0,
            'pates_farfalle': 0,
            'pates_orecchiette': 0,
            'quinoa': 2,
            'boulgour': 1.5,
            'lentilles': 1.5,
            'couscous': 1.5
        },
        protein: {
            'poulet_grille': 3,
            'poulet_crispy': 3.5,
            'boeuf': 4,
            'saumon': 5,
            'crevettes': 4.5,
            'tofu': 2.5,
            'falafel': 3,
            'oeufs': 2
        },
        vegetables: {
            'avocat': 1.5,
            'concombre': 0.5,
            'tomates': 0.5,
            'poivrons': 0.5,
            'champignons': 0.8,
            'betterave': 0.8,
            'radis': 0.5,
            'carottes': 0.5,
            'olives_noires': 0.8,
            'olives_vertes': 0.8,
            'cornichons': 0.5,
            'mais': 0.5,
            'oignons': 0.5,
            'edamame': 1,
            'pommes': 0.8,
            'raisins': 0.8,
            'noix': 1.2,
            'fromage_rape': 1.2,
            'feta': 1.5,
            'mozzarella': 1.5,
            'parmesan': 1.5
        },
        sauce: {
            'mayonnaise': 0.5,
            'ketchup': 0.5,
            'moutarde': 0.5,
            'algerienne': 0.8,
            'barbecue': 0.8,
            'pesto': 1,
            'fromagere': 1.2,
            'yaourt_citron': 0.8,
            'cesar': 1,
            'balsamique': 0.8,
            'miel_moutarde': 1,
            'sesame': 1.2,
            'ranch': 1
        },
        extras: {
            'graines_sesame': 0.8,
            'graines_chia': 0.8,
            'graines_tournesol': 0.8,
            'graines_courge': 0.8,
            'lin': 0.8,
            'pavot': 0.8,
            'noix_concasees': 1.2,
            'amandes_effilees': 1.2,
            'noix_cajou': 1.2,
            'cranberries_sechees': 1.2
        },
        drink: {
            'smoothie_banane': 3,
            'smoothie_fraise': 3,
            'smoothie_mangue': 3,
            'smoothie_fruits_rouges': 3,
            'smoothie_ananas_coco': 3,
            'smoothie_exotique': 3,
            'jus_orange': 2.5,
            'jus_citronnade': 2.5,
            'jus_pomme_gingembre': 2.5,
            'jus_carotte_orange': 2.5,
            'eau_plate': 1.5,
            'eau_petillante': 1.5,
            'soda': 1.5,
            'the_glace': 1.5
        }
    };
    return prices[type][value] || 0;
}

// Confirmation de commande
function confirmOrder() {
    const orderDetailsEl = document.getElementById('orderDetails');
    let details = '';
    
    bowls.forEach((bowl, index) => {
        details += `<h3>Bol ${index + 1}</h3>`;
        
        if (bowl.size) details += `<p><strong>Taille :</strong> ${getLabel('size', bowl.size)}</p>`;
        if (bowl.base) details += `<p><strong>Base :</strong> ${getLabel('base', bowl.base)}</p>`;
        if (bowl.protein) details += `<p><strong>Protéine :</strong> ${getLabel('protein', bowl.protein)}</p>`;
        
        if (bowl.vegetables.length > 0) {
            details += `<p><strong>Garnitures :</strong> ${bowl.vegetables.map(v => getLabel('vegetables', v)).join(', ')}</p>`;
        }
        
        if (bowl.sauce) details += `<p><strong>Sauce :</strong> ${getLabel('sauce', bowl.sauce)}</p>`;
        
        if (bowl.extras.length > 0) {
            details += `<p><strong>Suppléments :</strong> ${bowl.extras.map(e => getLabel('extras', e)).join(', ')}</p>`;
        }
        
        if (bowl.drink) details += `<p><strong>Boisson :</strong> ${getLabel('drink', bowl.drink)}</p>`;
    });
    
    details += `<p><strong>Total :</strong> ${calculateTotalPrice()}€</p>`;
    
    orderDetailsEl.innerHTML = details;
    showSlide(slides.length - 1); // Dernier slide = confirmation
}

// Réinitialisation
function resetOrder() {
    document.querySelectorAll('input').forEach(input => {
        input.checked = false;
    });
    
    bowls.length = 1;
    currentBowl = 1;
    bowls[0] = {
        size: null,
        base: null,
        protein: null,
        vegetables: [],
        sauce: null,
        extras: [],
        drink: null
    };
    
    showSlide(0);
    updateLivePrice();
}

// Écouteurs pour mise à jour en temps réel
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
        saveCurrentStep();
        updateLivePrice();
    });
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    document.getElementById('nextBtn1').disabled = true;
    document.getElementById('nextBtn2').disabled = true;
});