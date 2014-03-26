Shooter = Backbone.Model.extend({

})

ShooterView = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.render();
        this.detectCollision(self);
        this.growInterval = this.grow();
    },

    grow: function () {
        var self = this;
        setInterval(function () {
            self.$el.css({
                "width": "+=1"
            })
        }, 160)
    },

    goLeft: function () {
        this.$el.animate({
            "left": "-=30px"
        }, 10)
    },

    goRight: function () {
        this.$el.animate({
            "left": "+=30px"
        }, 10)
    },

    detectCollision: function (shooter) {
        var self = this;
        self.collisionInterval = setInterval(function () {
            var shooter_width = shooter.$el.width();
            var shooter_height = shooter.$el.height();
            var shooter_left = shooter.$el.offset().left;
            var shooter_top = shooter.$el.offset().top;

            game.spaceinvaderscollection.views.forEach(function (space_invader) {

                if (game.inProgress === false) {
                    return false;
                } else {

                    var space_invader_left = space_invader.$el.offset().left
                    var space_invader_top = space_invader.$el.offset().top

                    if ((Math.abs(space_invader_left - shooter_left) <= shooter_width) && (space_invader_top >= shooter_top)) {
                        
                        if (space_invader.trump === true) {
                            game.spaceinvaderscollection.views.forEach(function (invader) {
                                invader.$el.hide().remove();
                            })
                            return false;
                        }else if (space_invader.health === false) {
                            game.inProgress = false;
                            game.shooterview.gameOver();
                            return false;
                        } else {
                            var current_width = game.shooterview.$el.width()
                            game.shooterview.$el.css({
                                "width": (current_width / 2) + "px",
                            })
                        }

                    }

                }

            })
        }, 60)
    },

    gameOver: function () {
        console.log("running this function")
        game.shooterview.$el.hide("explode", {
            pieces: "36"
        }, 500, function () {
            clearInterval(self.collisionInterval);
            clearInterval(game.startGame);
            clearInterval(game.growInterval)
        })
    },

    className: "shooter_div",

    render: function () {
        var template = _.template($("#shooter_view").html());
        this.$el.html(template);
        $("#shooter_div_container").html(this.$el);
    }

})

SpaceInvader = Backbone.Model.extend({

})

SpaceInvaderView = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.health = false;
        this.render();
        game.spaceinvaderscollection.views.push(self);

    },

    className: "space_invader",

    render: function () {
        var self = this;
        var template = _.template($("#space_invader_view").html())
        this.$el.html(template);
        $("#space_invaders_container").append(this.$el);
        var window_width = $(window).width();
        var randomLeft = Math.floor(Math.random() * window_width)
        this.$el.css({
            "left": randomLeft
        })

        var dumb_array = [0, 0, 0, 0, 0, 1, 1, 2];
        var num = _.shuffle(dumb_array)[0]

        if (num === 1) {
            self.$el.css({ "background": "#00B545" })
            self.health = true;
        }else if (num === 2) {
            self.$el.css({ "background": "#00A08E", "width":"25px", "height":"25px", "border-radius":"50%" }) 
            self.trump = true;
        }

        this.attack();
    },

    attack: function () {
        var self = this;
        var arr = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        var randomNum = _.shuffle(arr)[0];
        var randomTime = Math.floor(randomNum * 3500);
        var window_height = $(window).height();
        this.$el.animate({
            "top": window_height + 100
        }, randomTime, function () {
            index = game.spaceinvaderscollection.views.indexOf(self);
            game.spaceinvaderscollection.views.splice(index, 1);
            self.remove();
            self.model.destroy();
        });
    }

})

SpaceInvadersCollection = Backbone.Collection.extend({

    initialize: function () {
        this.on("add", console.log("added"))
        this.on("remove", this.destroy)
        this.views = [];
    }
})


var game = {

    initialize: function () {
        var self = this;
        self.inProgress = true;
        self.shooter = new Shooter();
        self.shooterview = new ShooterView();
        self.spaceinvaderscollection = new SpaceInvadersCollection();
        self.time = 0;

        self.shooterListen();

        self.startGame = setInterval(function () {
            for (var i = 1; i <= ( self.time / 2 ); i++) {
                var spaceinvader = new SpaceInvader();
                var spaceinvaderview = new SpaceInvaderView({
                    model: spaceinvader
                })
                self.spaceinvaderscollection.add(spaceinvader);
            }
            $("#time").text(self.time += 1);
        }, 1000)


    },

    shooterListen: function () {
        $(document).on("keydown", function (e) {
            // need to put in validation so that shooter stays on page.
            if (e.keyCode === 37) {
                game.shooterview.goLeft();
            } else if (e.keyCode === 39) {
                game.shooterview.goRight();
            }
        })
    }

}


$(function () {
    var window_width = window.innerWidth;
    $(".shooter_div").css({ "margin-left": (window_width / 2) + "px" })
    game.initialize();
})