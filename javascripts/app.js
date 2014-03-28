ShooterView = Backbone.View.extend({

    initialize: function () {
        var self = this;
        this.render();
        this.detectCollision(self);
        this.grow = setInterval(function () {
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

    shoot: function () {
        new Bullet();
    },

    flash: function (color) {
        if (color === "#4F80E1") {
             var current_width = game.shooterview.$el.width();
             game.shooterview.$el.css({
            "width": (current_width / 2) + "px",
            "background": color
            })
        }else{
            game.shooterview.$el.css({
               "background": color 
            })
        }
        setTimeout(function () {
        game.shooterview.$el.css({
            "background": "#FF5F0D"
        })
    }, 60)
    },

    detectCollision: function (shooter) {
        var self = this;
        self.collisionInterval = setInterval(function () {

            game.shapeinvaderscollection.views.forEach(function (shape_invader) {

                if (game.inProgress === false) {
                    return false;
                } else {

                    var shooter_width = shooter.$el.width();
                    var shooter_height = shooter.$el.height();
                    var shooter_left = shooter.$el.offset().left;
                    var shooter_top = shooter.$el.offset().top;
                    var shape_invader_left = shape_invader.$el.offset().left
                    var shape_invader_top = shape_invader.$el.offset().top
                    var shape_invader_height = shape_invader.$el.data().height;
                    var shape_invader_width = shape_invader.$el.width();

                    if ((Math.abs(shape_invader_left - shooter_left) <= shooter_width) && (shape_invader_height + shape_invader_top >= shooter_top)) {

                        if (shape_invader.model.attributes.divine === true) {
                            shape_invader.$el.remove();
                            game.shooterview.flash("#FFC600");
                            game.clearBoard();
                            return false;
                        } else if (shape_invader.model.attributes.good === false) {
                            game.shapeinvaderscollection.reset();
                            game.inProgress = false;
                            game.gameOver();
                            return false;
                        } else {
                            shape_invader.$el.remove();
                            game.shooterview.flash("#4F80E1");
                        }

                    }
                }

            })
        }, 60)
    },

    className: "shooter_div",

    render: function () {
        var template = _.template($shooter_view.html());
        this.$el.html(template);
        $shooter_div_container.html(this.$el);
        var window_width = window.innerWidth;
        this.$el.css({
            "left": (window_width / 2) + "px"
        })
    }

})

BulletCollection = Backbone.Collection.extend({
    initialize: function () {
        this.views = [];
    }
})

Bullet = Backbone.View.extend({
    initialize: function () {
        // this.detectCollision();
        this.render();
        game.bulletcollection.views.push(this);
    },

    className: "bullet",

    // detectCollision: function () {
    //     if (this.$el) {
    //         setInterval(function () {

    //         }, 60)
    //     }
    // },

    render: function () {
        var template = _.template($("#bullet_view").html());
        this.$el.html(template);
        $body.append(this.$el);

        var shooter_left = game.shooterview.$el.offset().left;
        var shooter_top = game.shooterview.$el.offset().top;
        var half_shooter_width = (game.shooterview.$el.width() / 2);

        this.$el.css({
            "left": shooter_left + half_shooter_width + "px",
            "top": shooter_top + "px"
        })
        this.$el.animate({
            "top": "-" + $container.height() + "px"
        }, 2000, "linear", function () {
            $(this).remove();
        })
    }
})

ShapeInvader = Backbone.Model.extend({

})

ShapeInvaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
        game.shapeinvaderscollection.views.push(this);

    },

    className: "shape_invader",

    render: function () {
        var self = this;
        var template = _.template($shape_invader_view.html())
        self.$el.html(template);
        $shape_invaders_container.append(this.$el);
        var window_width = window.innerWidth;
        var randomLeft = Math.floor(Math.random() * window_width)
        self.$el.css({
            "left": randomLeft
        });

        var dumb_array = [0, 0, 0, 0, 0, 1, 1, 1, 2];
        var num = _.shuffle(dumb_array)[0]

        switch (num) {
            case 0:
                self.$el.addClass("evil-triangle").data({"height": 35});
                self.model.attributes.good = false;
                break;
            case 1:
                self.$el.addClass("gentle-square").data({"height": 35});
                self.model.attributes.good = true;
                break;
            case 2:
                self.$el.addClass("divine-circle").data({"height": 35});
                self.model.attributes.divine = true;
                break;
            default:
            console.log("??");
        }
        self.attack();
    },

    attack: function () {
        var self = this;
        var arr = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        var randomNum = _.shuffle(arr)[0];
        var randomTime = Math.floor(randomNum * 3000);
        var window_height = $container.height();
        self.$el.animate({
            "top": window_height + 100
        }, randomTime, function () {
            index = game.shapeinvaderscollection.views.indexOf(self);
            game.shapeinvaderscollection.views.splice(index, 1);
            self.remove();
            self.model.destroy();
        });
    }

})

ShapeInvadersCollection = Backbone.Collection.extend({

    initialize: function () {
        this.on("remove", this.destroy)
        this.views = [];
    }
})

FinishLine = Backbone.View.extend({
    initialize: function () {
        this.render();
        this.win_position;
    },

    className: "finish-line",

    render: function () {
        var template = _.template($("#finish_line").html());
        this.$el.html(template);
        $("body").append(this.$el);
        this.win_position = this.$el.position();
        console.log(this.$el)
        console.log(this.win_position)
    },

    kill: function () {
        this.unbind();
        this.remove();
    }
})

var game = {

    initialize: function () {
        $container.animate({"height":"99%"});
        var self = this;
        self.inProgress = true;
        self.shooterview = new ShooterView();
        self.shapeinvaderscollection = new ShapeInvadersCollection();
        self.bulletcollection = new BulletCollection();
        self.finishline = new FinishLine();
        self.time = 0;

        self.startGame = setInterval(function () {
            for (var i = 1; i <= (self.time / 2); i++) {
                var shapeinvader = new ShapeInvader();
                var shapeinvaderview = new ShapeInvaderView({
                    model: shapeinvader
                })
                self.shapeinvaderscollection.add(shapeinvader);
            }
            $time.text(self.time += 1);
            var container_height = $container.height()
            container_height -= 5;
            $container.css({"height": container_height+"px"});

        }, 1000)

    },

    clearBoard: function () {
        game.shapeinvaderscollection.views.forEach(function (invader) {
            invader.$el.hide().remove();
        })
    },

    gameOver: function () {
        game.shooterview.$el.hide("explode", {
            pieces: "36"
        }, 500, function () {
            game.clearBoard();
            game.finishline.kill();
            clearInterval(game.shooterview.collisionInterval);
            clearInterval(game.shooterview.growInterval);
            clearInterval(game.startGame);
            $intro.show();
        })
    }

}

$(function () {

    $body = $("body");
    $container = $("#container");
    $intro = $("#intro");
    $time = $("#time");
    $shooter_div_container = $("#shooter_div_container");
    $shooter_div = $(".shooter_div");
    $shape_invaders_container = $("#shape_invaders_container");
    $shape_invader_view = $("#shape_invader_view");
    $shooter_view = $("#shooter_view");

    $(document).on("keydown", function (e) {
        if (game.inProgress) {
            // need to put in validation so that shooter stays on page.
            if (e.keyCode === 37) {
                game.shooterview.goLeft();
            } else if (e.keyCode === 39) {
                game.shooterview.goRight();
            } else if (e.keyCode === 38) {
                game.shooterview.shoot();
            }
        }else{
            if (e.keyCode === 13) {
                $intro.hide();
                game.initialize();
            }
        }
    });

});