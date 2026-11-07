$(document).ready(function () {

    // fonction qui va appeler l'api pour récupérer les brasseries
    function chargerBrasseries(data_recherche) {
        // let pour pouvoir changer l'url plus tard si il y a besoin
        let apiUrl = 'https://api.openbrewerydb.org/v1/breweries?by_country=germany';

        // requête AJAX
        return $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            data: data_recherche,
        });
    }

    $('#formulaire').on('submit', function (event) {
        event.preventDefault();


        let data_recherche = {}
        if ($('#ville').val() !== '') {
            data_recherche.by_city = $('#ville').val(); /* empecher le script d'envoyer une valeur fausse comme data (et de n'etre pas obligé d'entrer une information) */
        }
        if ($('#type').val() !== '') {
            data_recherche.by_type = $('#type').val();
        }
        if ($('#land').val() !== '') {
            data_recherche.by_state = $('#land').val();
        }
        data_recherche.per_page = $('#number').val();

        $('#message').text("Chargement...");

        // Désactive la possibilité de cliquer sur le bouton d'envoi pour éviter le double-clic
        $('button[type="submit"]').prop('disabled', true);

        chargerBrasseries(data_recherche)

            .then(function (brasseries) {
                if (brasseries.length === 0) {
                    $('#resultats').empty();
                    $('#message').text("Aucune brasserie trouvée");
                } else {
                    afficherResultats(brasseries);
                    $('#message').text( `${brasseries.length} brasserie(s) trouvée(s)`);
                }
            })
            .catch(function (e) {
                console.error(e);
                $('#message').text("Impossible de contacter l’API");
            }) 
            .always(function () {
                // Réactive le bouton
                $('button[type="submit"]').prop('disabled', false);
            })
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