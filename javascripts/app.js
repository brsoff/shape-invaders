Shooter = Backbone.Model.extend({

})

ShooterView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    goLeft: function () {
        this.$el.animate({
            "left":"-=100px"
        }, 100)
    },

    goRight: function () {
        this.$el.animate({
            "left":"+=100px"
        }, 100)
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
        this.render();
    },

    className: "space_invader",

    render: function () {
        var template = _.template($("#space_invader_view").html())
        this.$el.html(template);
        $("#space_invaders_container").append(this.$el);
        var window_width = $(window).width();
        var randomLeft = Math.floor( Math.random() * window_width )
        this.$el.css({ "left": randomLeft})
        this.attack();
    },

    attack: function () {
        var self = this;
        var randomTime = Math.floor( Math.random() * 3000);
        var window_height = $(window).height();
        this.$el.animate({ "top": window_height + 100 }, randomTime);

        setInterval(function () {
            // console.log(self.$el.position());
        }, 50)
    }

})

SpaceInvadersCollection = Backbone.Collection.extend({
    
    initialize: function () {
        this.on("add", console.log("added"))
        this.on("remove", this.destroy)
    }
})


var game = {

    initialize: function () {
        var self = this;
        self.inProgress = true;
        self.shooter = new Shooter();
        self.shooterview = new ShooterView();
        self.spaceinvaderscollection = new SpaceInvadersCollection();
        
        setInterval(function () {
            for (var i = 1; i <= 3; i++) {
                var spaceinvader = new SpaceInvader();
                var spaceinvaderview = new SpaceInvaderView({model: spaceinvader})
                self.spaceinvaderscollection.add(spaceinvader); 
            }
        }, 2000)
    }

}


$(function () {
    var window_width = window.innerWidth;
    console.log(window_width)
    $(".shooter_div").css({"margin-left": (window_width / 2)+"px"})

    game.initialize();

        $(document).on("keyup", function (e) {
            if (e.keyCode === 37) {
                game.shooterview.goLeft();
            }else if (e.keyCode === 39) {
                game.shooterview.goRight();
            }
        })
})