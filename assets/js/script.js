$(document).ready(function() {

    // fonction qui va call l'api pour recup les brasseries
    function chargerBrasseries() {
        // let pour pouvoir changer l'url plus tard si il y a besoin
        let apiUrl = 'https://api.openbrewerydb.org/v1/breweries?by_country=germany&per_page=50';

        // requête AJAX
        $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                // on envoit la data recupérée à la fonction qui va l'afficher
                afficherResultats(data);
            },
            error: function(error) {
                console.error('Erreur API :', error);
                $('#resultats').html('<p>Erreur lors du chargement des données.</p>');
            }
        });
    }

    // on appelle la fonction direct pour que les brasseries s'affichent dès le début
    chargerBrasseries();

    // fonction d'affichage
    function afficherResultats(brasseries) {
        const $resultats = $('#resultats');
        $resultats.empty();
        brasseries.forEach(brasserie => {
            $resultats.append(`
                <div>
                    <h3>${brasserie.name}</h3>
                    <p>${brasserie.city || 'Ville non précisée'}</p>
                </div>
            `);
        });
    }

});