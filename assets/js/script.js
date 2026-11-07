$(document).ready(function() {

    // fonction qui va appeler l'api pour récupérer les brasseries
    function chargerBrasseries(data_recherche) {
        // let pour pouvoir changer l'url plus tard si il y a besoin
        let apiUrl = 'https://api.openbrewerydb.org/v1/breweries?by_country=germany&per_page=50';

        // requête AJAX
        $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            data: data_recherche,
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

    $('#formulaire').on('submit', function(event){
        event.preventDefault();


        let data_recherche = {}
        if ($('#ville').val() !== ''){
            data_recherche.by_city = $('#ville').val(); /* empecher le script d'envoyer une valeur fausse comme data (et de n'etre pas obligé d'entrer une information) */
        }
        if ($('#type').val() !== ''){
            data_recherche.by_type = $('#type').val();
        }
        
        


        chargerBrasseries(data_recherche);
    });


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