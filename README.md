# UEL220-Brasseries-allemandes
## Description
Dans le cadre de nos études nous devions réaliser un mini-projet qui s'articule autour de l'utilisation de l'API "Open Brewery DB". Nous avons donc convenu d'un projet de recherche de brasserie en Allemagne par ville, Land(état), et type, permettant d'afficher le nom de la brasserie et sa position sur la carte ainsi que son site-web.

## Fonctionnalités
- Recherche multicritère avec limite : Possibilité de rechercher 5 ou 10 brasseries ouvertes, de rechercher par ville, Land(état) ou type.
- Affichage au chargement : 10 brasseries s'affichent automatiquement au chargement ainsi que leurs 10 marqueurs sur la carte.
- Fiches enrichies : Chaque brasserie trouvée apparait sous forme de cartes avec le type, le nom, l'adresse, le numéro s'il existe, un lien vers le site web s'il existe et un lien vers google maps.
- Brasserie au hasard : Possibilité de récupérer le nombre total de brasseries allemandes répertorier par l'API et d'afficher une brasserie au hasard parmi elles.
- Brasseries les plus proches : Si vous acceptez la prise de position, le site vous trouve les 5 brasseries allemandes les plus proches de vous
- Carte : Une carte est présente sur la page grâce à la blibliothèque exterieure Leaflet, chaque résultat possédant une latitude et une longitude apparait sur la carte avec un marqueur. 
- Itinéraire : Si minimum deux brasseries sont cochées vous pouvez avoir un itinéraire entre chaque brasserie cochée directement sur google maps  
- Responsive : L'intégralité du site a été adaptée et testée pour mobile.

## Technologies 
- HTML
- CSS
- JavaScript 
- jQuery 4 (AJAX et promesses)
- Leaflet
- API Open Brewery DB
- tuiles OpenStreetMap

## Lancer le projet 
Ouvrir le dossier dans VS Code et lancer Live Server. La géolocalisation sera bloquée si vous ouvrez directement index.html .

## Équipe 
Groupe 6, Jesse, Valentin et Mathis.
