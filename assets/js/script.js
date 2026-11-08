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
                const ouvertes = brasseries.filter(brasserie => brasserie.brewery_type !== 'closed' && brasserie.brewery_type !== 'planning')
                if (ouvertes.length === 0) {
                    $('#resultats').empty();
                    $('#message').text("Aucune brasserie trouvée");
                } else {
                    afficherResultats(ouvertes);
                    $('#message').text(`${ouvertes.length} brasserie(s) trouvée(s)`);
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
        // Vide les marqueurs
        marqueurs.clearLayers();
        brasseries.forEach(brasserie => {
            const $carte = $('<div>').addClass('carte');
            $('<span>').text(brasserie.brewery_type).addClass('type').appendTo($carte);
            $('<h3>').text(brasserie.name).appendTo($carte);

            const morceaux = [brasserie.address_1, brasserie.postal_code, brasserie.city];
            const adresse = morceaux.filter(morceau => morceau).join(' ');
            $('<p>').text(adresse || 'Adresse non précisée').appendTo($carte);
            if (brasserie.phone) {
                $('<p>').text(brasserie.phone).appendTo($carte);
            }
            if (brasserie.website_url) {
                $('<a>').attr('href', brasserie.website_url).attr('target', "_blank").text('Site web').appendTo($carte);
            }

            const recherche = brasserie.name + ' ' + adresse;
            const requete = encodeURIComponent(recherche);
            $('<a>').attr('href', "https://www.google.com/maps/search/?api=1&query=" + requete).attr('target', "_blank").text('Voir sur Google Maps').appendTo($carte);

            if (brasserie.latitude && brasserie.longitude) {
                // Ajout d'un marqueur
                const $bulle = $('<div>');
                $('<strong>').text(brasserie.name).appendTo($bulle);
                $('<p>').text(adresse).appendTo($bulle);
                L.marker([brasserie.latitude, brasserie.longitude]).addTo(marqueurs).bindPopup($bulle[0]);

                // Itinéraire 
                const etape = brasserie.latitude + ',' + brasserie.longitude;
                const $labelEtape = $('<label>').addClass('etape').appendTo($carte);
                $('<input type="checkbox">').val(etape).appendTo($labelEtape);
                $('<span>').text("Ajouter à l’itinéraire").appendTo($labelEtape);
            }

            $carte.appendTo($resultats);
        });
        // Zoom sur les résultats si il y en a
        if (marqueurs.getLayers().length > 0) {
            carteLeaflet.fitBounds(marqueurs.getBounds(), { maxZoom: 13 });
        }
    }



    // fonction pour charger le total des brasseries allemandes
    function chargerTotal() {
        let apiUrl = "https://api.openbrewerydb.org/v1/breweries/meta"
        return $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            data: { by_country: 'germany' },
        });
    }



    // Gestion de la brasserie aléatoire
    $('#aleatoire').on('click', function () {
        $('#message').text("Chargement...");
        chargerTotal()
            .then(function (meta) {
                const numeroAleatoire = Math.floor(Math.random() * meta.total) + 1;
                return chargerBrasseries({ per_page: 1, page: numeroAleatoire });
            })
            .then(function (brasseries) {
                afficherResultats(brasseries);
                $('#message').text("Brasserie tirée au sort");
            })
            .catch(function (e) {
                console.error(e);
                $('#message').text("Impossible de contacter l’API");
            });
    });


    // fonction pour obtenir la position afin d'avoir les brasseries les plus proches.
    function obtenirPosition() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    // Gestion des brasseries les plus proches
    $('#proche').on('click', function () {
        $('#message').text("Localisation en cours...");
        obtenirPosition()
            .then(function (position) {
                const coordonnees = position.coords.latitude + ',' + position.coords.longitude;
                return chargerBrasseries({ by_dist: coordonnees, per_page: 5 });
            })
            .then(function (brasseries) {
                const ouvertes = brasseries.filter(brasserie => brasserie.brewery_type !== 'closed' && brasserie.brewery_type !== 'planning')
                if (ouvertes.length === 0) {
                    $('#resultats').empty();
                    $('#message').text("Aucune brasserie trouvée");
                } else {
                    afficherResultats(ouvertes);
                    $('#message').text(`${ouvertes.length} brasserie(s) trouvée(s) autour de vous`);
                }
            })
            .catch(function (e) {
                if (e.code === 1) {
                    $('#message').text("Vous avez refusé la localisation : impossible de trouver les brasseries proches");
                } else {
                    console.error(e);
                    $('#message').text("Impossible de contacter l’API");
                }
            });
    });

    // Gestion de l'itinéraire
    $('#itineraire').on('click', function () {
        // 1. Récupérer la valeur de chaque case cochée
        const etapes = [];
        $('#resultats input:checked').each(function () {
            etapes.push($(this).val());
        });

        // 2. Il faut au moins un départ et une arrivée
        if (etapes.length <= 1) {
            $('#message').text("Cochez au moins deux brasseries pour créer un itinéraire");
            return;
        }

        // 3. Construire l'adresse Google Maps
        let url = 'https://www.google.com/maps/dir/?api=1'
            + '&origin=' + encodeURIComponent(etapes[0])         // la première étape
            + '&destination=' + encodeURIComponent(etapes[etapes.length - 1]);   // la dernière étape

        const milieu = etapes.slice(1, -1);     // tout sauf la première et la dernière
        if (milieu.length > 0) {
            url += '&waypoints=' + encodeURIComponent(milieu.join('|'));
        }

        // 4. Ouvrir l'itinéraire dans un nouvel onglet
        window.open(url, '_blank');
    });


    // Gestion de la carte leaflet 
    const carteLeaflet = L.map('carte-leaflet').setView([51.16, 10.45], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(carteLeaflet);
    const marqueurs = L.featureGroup().addTo(carteLeaflet);


    // Affiche 10 brasseries dès le départ
    $('#formulaire').trigger('submit');
});