enchant();
window.onload = function() {
    var game = new Game();
    game.preload("chara1.png");
    game.onload = function() {
        var player = new Sprite(32, 32);
        player.image = game.assets["chara1.png"];
        player.frame = 0;
        player.x = 144;
        player.y = 288;
        game.rootScene.addChild(player);

        var enemy = new Sprite(32, 32);
        enemy.image = game.assets["chara1.png"];
        enemy.frame = 5;
        enemy.x = 144;
        enemy.y = 0;
        game.rootScene.addChild(enemy);

        var data = BulletML
                .build("<bulletml><action label='top'><fire><bullet/></fire></action></bulletml>");
        var pattern = new AttackPattern(data);
        var ticker = pattern.createTicker(player);
        
        enemy.on("enterframe", ticker);
    };
    game.start();
};
