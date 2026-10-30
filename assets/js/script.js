$(document).ready(function() {

    function chargerBrasseries() {
        const ville = $('#ville').val();
        const type = $('#type').val();
        let apiUrl = 'https://api.openbrewerydb.org/breweries?by_state=Germany&per_page=50';
        
        if (ville) {
            apiUrl += `&by_city=${encodeURIComponent(ville)}`;
        }

        if (type) {
            apiUrl += `&by_type=${encodeURIComponent(type)}`;
        }

        $.ajax({
            url : apiUrl,
            method : 'GET',
            dataType : 'json',
            success : function(data) {
                afficherResultats(data);
            },
            error : function(error) {
                console.error('Erreur lors du chargement des brasseries :', error);
                $('#resultats').html('<p>Une erreur est survenue lors du chargement des brasseries.</p>');
                $('#compteur').empty();
            }
        });
    }

    chargerBrasseries();

    function afficherResultats(brasseries) {
        const $resultats = $('#resultats');
        $resultats.empty();
        $('#compteur').text(`${brasseries.length} brasseries trouvées`);

        brasseries.forEach(brasserie => {
            const nom = brasserie.name || 'Nom inconnu';
            const ville = brasserie.city || 'Ville inconnue';
            const type = brasserie.brewery_type || 'Type inconnu';
            const $carte = $('<div>').addClass('brasserie');

            $('<h3>').text(nom).appendTo($carte);
            $('<p>').text(`Ville : ${ville}`).appendTo($carte);
            $('<p>').text(`Type : ${type}`).appendTo($carte);
            $resultats.append($carte);
        });
    }

    $('#ville, #type').on('change', chargerBrasseries);
});