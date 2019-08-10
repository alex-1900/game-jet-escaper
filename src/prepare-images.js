function prepareImages(images) {
    var finalImages = {};

    var proportion = 0.4;

    // Heros
    var hero = images.img_plane_main;
    finalImages.hero_0 = Dom.imageSplit(hero, 0, 0, 136, 89, proportion);
    finalImages.hero_1 = Dom.imageSplit(hero, 392, 101, 120, 95, proportion);
    finalImages.hero_2 = Dom.imageSplit(hero, 0, 351, 95, 90, proportion);
    finalImages.hero_3 = Dom.imageSplit(hero, 110, 291, 105, 80, proportion);

    // enemies
    var enemy = images.img_plane_enemy;
    finalImages.enemy_0 = Dom.imageSplit(enemy, 0, 482, 104, 77, proportion);
    finalImages.enemy_1 = Dom.imageSplit(enemy, 160, 475, 106, 75, proportion);
    finalImages.enemy_2 = Dom.imageSplit(enemy, 276, 553, 71, 62, proportion);
    finalImages.enemy_3 = Dom.imageSplit(enemy, 102, 550, 101, 72, proportion);

    // bullets
    var bullet_size0 = images.img_bullet_size0;
    finalImages.bullet0_0 = Dom.imageSplit(bullet_size0, 0, 0, 16, 16, proportion);
    finalImages.bullet0_1 = Dom.imageSplit(bullet_size0, 16, 0, 16, 16, proportion);

    var bullet_size1 = images.img_bullet_size1;
    finalImages.bullet1_0 = Dom.imageSplit(bullet_size1, 54, 10, 22, 22, proportion);
    finalImages.bullet1_1 = Dom.imageSplit(bullet_size1, 0, 0, 21, 58, proportion);
    finalImages.bullet1_2 = Dom.imageSplit(bullet_size1, 26, 10, 18, 32, proportion);

    var bullet_size2 = images.img_bullet_size2;
    finalImages.bullet2_0 = Dom.imageSplit(bullet_size2, 0, 0, 16, 16, proportion);
    finalImages.bullet2_1 = Dom.imageSplit(bullet_size2, 16, 0, 16, 16, proportion);

    finalImages.bg_ui0 = Dom.imageSplit(images.img_bg_level_2, 290, 330, 100, 100, proportion);

    finalImages.bg0 = images.img_bg_level_2;
    finalImages.bg1 = images.img_bg_level_3;
    finalImages.bg2 = images.img_bg_level_4;
    finalImages.bg3 = images.img_bg_level_5;

    finalImages.bg_logo = images.img_bg_logo;
    finalImages.letter_peek = images.letter_peek;

    return finalImages;
}