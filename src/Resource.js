var s_resourceDirectory = "";
var s_imageDirectory = "";
var s_musicDirectory = "";
var s_soundDirectory = "";
var s_levelDirectory = "";
var s_plistDirectory = "";

var dirImg = "";
var dirMusic = "";
var musicSuffix = ".mp3";
if( cc.config.deviceType == 'browser') {
    s_resourceDirectory = "res/";
    s_levelDirectory = s_resourceDirectory + "level/";
    s_musicDirectory = s_resourceDirectory + "music/";
    s_soundDirectory = s_resourceDirectory + "sound/";
    s_imageDirectory = s_resourceDirectory + "image/";
    s_plistDirectory = s_resourceDirectory + "image/";
    dirImg = "Game02/res/";
    dirMusic = "Game02/res/Music/";
    musicSuffix = "";
}
//levels
var s_level_01 = s_levelDirectory + "01.tmx";

//images
var s_image_background_01 = s_imageDirectory + "bg01.png";
var s_image_level_01 = s_levelDirectory + "01.png";
var s_image_background_loading = s_imageDirectory + "loading.png";
var s_image_logo = s_imageDirectory + "logo.png";
var s_image_gameover = s_imageDirectory + "gameover.png";
var s_image_menu = s_imageDirectory + "menu.png";
var s_image_menutitle = s_imageDirectory + "menutitle.png";
var s_image_player_sprite = s_imageDirectory + "player.png";
var s_image_explosion_sprite = s_imageDirectory + "explosion.png";
var s_image_enemy_sprite = s_imageDirectory + "enemy.png";
var s_image_bullet_sprite = s_imageDirectory + "bullet.png";
var s_image_hit = s_imageDirectory + "hit.jpg";

//music
var s_music_theme = s_musicDirectory + "theme" + musicSuffix;

//sound effects
var s_sound_arrow_shot = s_soundDirectory + "arrow-shot" + musicSuffix;

//plist
var s_plist_explosion = s_plistDirectory + "explosion.plist";
var s_plist_player = s_plistDirectory + "player.plist";
var s_plist_enemy = s_plistDirectory + "enemy.plist";
var s_plist_bullet = s_plistDirectory + "bullet.plist";

//image
//var s_bg01 = dirImg + "bg01.jpg";
//var s_b01 = dirImg + "b01.png";
//var s_loading = dirImg + "loading.png";
//var s_ship01 = dirImg + "ship01.png";
//var s_menu = dirImg + "menu.png";
//var s_logo = dirImg + "logo.png";
//var s_cocos2dhtml5 = dirImg + "cocos2d-html5.png";
//var s_gameOver = dirImg + "gameOver.png";
//var s_menuTitle = dirImg + "menuTitle.png";
//var s_Enemy = dirImg + "Enemy.png";
//var s_flare = dirImg + "flare.jpg";
//var s_bullet = dirImg + "bullet.png";
//var s_explosion = dirImg + "explosion.png";
//var s_explode1 = dirImg + "explode1.jpg";
//var s_explode2= dirImg + "explode2.jpg";
//var s_explode3 = dirImg + "explode3.jpg";
//var s_hit = dirImg + "hit.jpg";
//var s_arial14 = dirImg + "arial-14.png";
//var s_arial14_fnt = dirImg + "arial-14.fnt";
//
////music
//var s_bgMusic = dirMusic + "bgMusic" + musicSuffix;
//var s_mainMainMusic = dirMusic + "mainMainMusic" + musicSuffix;
//
////effect
//var s_buttonEffect = dirMusic + "buttonEffet" + musicSuffix;
//var s_explodeEffect = dirMusic + "explodeEffect" + musicSuffix;
//var s_fireEffect = dirMusic + "fireEffect" + musicSuffix;
//var s_shipDestroyEffect = dirMusic + "shipDestroyEffect" + musicSuffix;
//
////tmx
//var s_level01 = dirImg + "level01.tmx";
//
////plist
//var s_Enemy_plist = dirImg + "Enemy.plist";
//var s_explosion_plist = dirImg + "explosion.plist";
//var s_bullet_plist = dirImg + "bullet.plist";

var g_resources = [
    //levels
    {type:"tmx", src:s_level_01},
    //images
    {type:"image", src:s_image_background_01},
    {type:"image", src:s_image_level_01},
    {type:"image", src:s_image_background_loading},
    {type:"image", src:s_image_logo},
    {type:"image", src:s_image_gameover},
    {type:"image", src:s_image_menu},
    {type:"image", src:s_image_menutitle},
    {type:"image", src:s_image_player_sprite},
    { type: "image", src: s_image_explosion_sprite },
    { type: "image", src: s_image_enemy_sprite },
    { type: "image", src: s_image_bullet_sprite },
    { type: "image", src: s_image_hit },

    //music
    {type:"bgm", src:s_music_theme},

    //effects
    {type:"effect", src:s_sound_arrow_shot},

    //plist
    {type: "plist", src: s_plist_explosion },
    { type: "plist", src: s_plist_enemy },
    { type: "plist", src: s_plist_bullet },
    { type: "plist", src: s_plist_player }

    //image
    /*{type:"image", src:s_bg01},
    {type:"image", src:s_b01},
    {type:"image", src:s_loading},
    {type:"image", src:s_ship01},
    {type:"image", src:s_menu},
    {type:"image", src:s_logo},
    {type:"image", src:s_cocos2dhtml5},
    {type:"image", src:s_gameOver},
    {type:"image", src:s_menuTitle},
    {type:"image", src:s_Enemy},
    {type:"image", src:s_flare},
    {type:"image", src:s_bullet},
    {type:"image", src:s_explosion},
    {type:"image", src:s_explode1},
    {type:"image", src:s_explode2},
    {type:"image", src:s_explode3},
    {type:"image", src:s_hit},
    {type:"image", src:s_arial14},

    //tmx
    {type:"tmx", src:s_level01},

    //plist
    {type:"plist", src:s_Enemy_plist},
    {type:"plist", src:s_explosion_plist},
    {type:"plist", src:s_bullet_plist},

    //music
    {type:"bgm", src:s_bgMusic},
    {type:"bgm", src:s_mainMainMusic},

    //effect
    {type:"effect", src:s_buttonEffect},
    {type:"effect", src:s_explodeEffect},
    {type:"effect", src:s_fireEffect},
    {type:"effect", src:s_shipDestroyEffect},

    // FNT
    {type:"fnt", src:s_arial14_fnt}*/


];
