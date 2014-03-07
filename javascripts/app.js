Shooter = Backbone.Model.extend({

})

ShooterView = Backbone.View.extend({

    initialize: function () {
        this.render();
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
        this.render();
    },

    className: "space_invader",

    render: function () {
        var template = _.template($("#space_invader_view").html())
        this.$el.html(template);
        $("#space_invaders_container").append(this.$el);
    },

    attack: function () {
        var window_height = $(window).height();
        this.$el.animate({
            "margin-top": window_height
        })
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

        self.shooter = new Shooter();
        self.shooterview = new ShooterView();


        self.spaceinvaderscollection = new SpaceInvadersCollection();
        

        setInterval(function () {
            var spaceinvader = new SpaceInvader();
            var spaceinvaderview = new SpaceInvaderView({model: spaceinvader})
            self.spaceinvaderscollection.add(spaceinvader); 
        }, 2000)
            
        
    }

}




$(function () {
    game.initialize();
})