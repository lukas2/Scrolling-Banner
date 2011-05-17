/**
  Copyright (C) 2011 by Lukas Zielinski

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  */ 

$(function() {
  scrollBox = new ScrollBanner($("#scrollbox"), $("#scrollbox_position"), null);
});

ScrollBanner = function(container, position, type){
  // type for now is being ignored
  // set speed in milliseconds, less is faster.
  this.animation_speed = 400;

  this.container = container;
  this.position = position;
  this.selected = 0;
  this.numBanners = 0;
  this.marginleft = 0;
  this.banners = null;
  this.wrapper = container.children(":first-child");
  this.bannerWidth = 0;
  this.initBanners(container);
  this.initPosition(position);
  this.locked = false;
}

ScrollBanner.prototype.initBanners = function(container)
{
  this.banners = $("#" + container.attr("id") + " > div > div[id^=" + container.attr("id") + "]");
  this.numBanners = this.banners.length;

  // make all banners the same width and apply float
  this.banners.each(function(e){
    $(this).css("width", container.width() + "px");
    $(this).css("height", container.height() + "px");
    $(this).css("float", "left");
  });

  this.bannerWidth = this.banners.first().width();
  this.wrapper.css("width", this.bannerWidth * this.banners.size() + "px");
}

ScrollBanner.prototype.initPosition = function(position)
{
  position.empty();
  for(var i = 0; i < this.banners.length; i++)
  {
    var class = "inactive_bullet";
    if(i == this.selected) { class = "active_bullet" };
    var bullet = position.append("<li class='" + class + "'>&bull;</li>");
  }
}

ScrollBanner.prototype.reAttachRight = function()
{
  this.banners.parent().append(this.banners.first());
  this.initBanners(this.container);
  this.marginleft = 0;
  this.wrapper.css({ marginLeft: "0px" });
  this.unLock();
}

ScrollBanner.prototype.preAttachLeft = function()
{
  this.banners.parent().prepend(this.banners.last());
  this.initBanners(this.container);
  this.marginleft = + this.bannerWidth;
  this.wrapper.css({ marginLeft: (- this.bannerWidth) + "px" });
}

ScrollBanner.prototype.next = function()
{
  if(this.locked) return; this.lock();

  var that = this;
  newMargin = - this.bannerWidth;
  this.wrapper.animate({ marginLeft: newMargin + "px"}, this.animation_speed, function() { that.reAttachRight() });

  this.nextBullet();
}

ScrollBanner.prototype.prev = function()
{
  if(this.locked) return; this.lock();

  var that = this;
  this.preAttachLeft();
  this.wrapper.animate({ marginLeft: "0px"}, this.animation_speed, function() { that.unLock(); }) ;

  this.previousBullet();
}

ScrollBanner.prototype.lock = function() { this.locked = true; }
ScrollBanner.prototype.unLock = function() { this.locked = false; }

ScrollBanner.prototype.nextBullet = function() { 
  this.selected++;
  if(this.selected >= this.numBanners) { this.selected = 0; }
  this.initPosition(this.position);
}
ScrollBanner.prototype.previousBullet = function() { 
  this.selected--;
  if(this.selected < 0) { this.selected = this.numBanners - 1; }
  this.initPosition(this.position);
}
