async function confirmOrder() {
    const total = calculateTotalPrice();
    
    // 1. Envoyez la commande à votre backend
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: total * 100, // Convertir en centimes
            currency: 'eur', // ou 'dzd' si disponible
            metadata: {
                order_id: generateOrderId() // À implémenter
            }
        })
    });
    
    const { clientSecret } = await response.json();
    
    // 2. Affichez le formulaire de paiement Stripe
    const stripe = Stripe('votre_clé_publique_stripe');
    const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement('card'),
            billing_details: {
                name: document.getElementById('card-name').value
            }
        }
    });
    
    if (error) {
        alert(`Paiement échoué: ${error.message}`);
    } else {
        alert('Paiement réussi!');
        window.location.href = '/confirmation';
    }
}

// Dans votre page paiement.html
document.addEventListener('DOMContentLoaded', function() {
    // Récupération du montant
    const urlParams = new URLSearchParams(window.location.search);
    const total = urlParams.get('total');
    
    // Affichage avec le symbole DA
    if (total) {
        document.getElementById('total-amount').textContent = `${total} DA`;
    } else {
        document.getElementById('total-amount').textContent = "0 DA";
        console.error("Le montant n'a pas été transmis");
    }
});