# 3. Lisää tietokantaasi taulu nimeltä car, jossa int-tyyppinen perusavain ja tekstikentät branch ja
  model. Kopio taulun luomiseen kirjoittamasi SQL-koodi reposi README-tiedostoon.

  CREATE TABLE car (
    id_car INT AUTO_INCREMENT PRIMARY KEY,
    branch VARCHAR(255),
    model VARCHAR(255)
);
