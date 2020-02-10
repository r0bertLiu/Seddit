function createFeed(root_div) {
  // create feed div
  var ul_feed = document.createElement("ul");
  ul_feed.id = "feed";
  ul_feed.setAttribute('data-id-feed', '');
  root_div.appendChild(ul_feed);
  // create feed-header
  if (Number(localStorage.logged_in) === 0) {
    createPublicPosts(ul_feed);
  } else {
    createPersonalPageModel(root_div);
    createPersonalPosts(ul_feed);
  }
}

function createPublicPosts(ul_feed){
  var feed_header = document.createElement("div");
  feed_header.className = "feed-header";
  var feed_title = document.createElement("h3");
  feed_title.classList.add("feed-title", "alt-text");
  feed_title.appendChild(document.createTextNode("Public Popular Posts"));
  feed_header.appendChild(feed_title);
  ul_feed.appendChild(feed_header);
  // fetch the public post from backend
  const promise_posts = fetch("http://127.0.0.1:5000/post/public")
    .then(response => response.json())
    .then(myJson => myJson.posts);
  // create the posts by public promise fetched from backend
  createPosts(promise_posts, ul_feed);
}

function createPersonalPosts(ul_feed){
  var feed_header = document.createElement("div");
  feed_header.className = "feed-header";
  var feed_title = document.createElement("h3");
  feed_title.classList.add("feed-title", "alt-text");
  feed_title.appendChild(document.createTextNode("Your Popular Posts"));
  feed_header.appendChild(feed_title);
  var post_btn = document.createElement('button');
  post_btn.className = "button button-secondary";
  post_btn.appendChild(document.createTextNode('Post'));
  post_btn.addEventListener("click", postBtn);
  feed_header.append(post_btn);
  ul_feed.appendChild(feed_header);

  localStorage.last_posts = 0;

  // create user's posts
  // fetch the user's post from backend
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
  
  const data = {
    "method" : 'GET',
    "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
    }
   };

  // fetch max 5 personal posts from backend
  const promise_posts = fetch("http://127.0.0.1:5000/user/feed?p=0&n=5", data)
    .then(response => response.json())
    .then(myJson => myJson.posts);

  // create the posts by personl promise fetched from backend
  createPosts(promise_posts, ul_feed);
}

function createPosts(promise_posts, ul_feed){
  var posts_length = promise_posts.then(function(posts){
    for (var i = 0; i < posts.length; i++) {
      // create post li
      var new_li = document.createElement("li");
      new_li.className = "post";
      new_li.setAttribute('data-id-post', '');
      ul_feed.appendChild(new_li);
      // create a 'p' to store the id of post
      var id_p = document.createElement("p");
      id_p.appendChild(document.createTextNode(posts[i].id));
      id_p.style.display = 'none';
      new_li.appendChild(id_p);
      // create vote elem
      var vote_div = document.createElement('div');
      vote_div.className = "vote";
      new_li.appendChild(vote_div);
      // create up_vote_icon
      var up_vote_icon_div = document.createElement('div');
      var up_vote_icon = document.createElement('i');
      up_vote_icon.appendChild(document.createTextNode('expand_less'));
      up_vote_icon_div.appendChild(up_vote_icon);
      // create vote_number
      var vote_num_div = document.createElement('div');
      vote_num_div.className = "vote-num-hover";
      var vote_num = document.createElement('p');
      vote_num.className = "vote-num";
      vote_num.appendChild(document.createTextNode(posts[i].meta.upvotes.length));
      vote_num_div.appendChild(vote_num);
      // get show upVotes function
      vote_num.addEventListener("click", showUpVotes);
      // create down_vote_icon
      var down_vote_icon_div = document.createElement('div');
      var down_vote_icon = document.createElement('i');
      down_vote_icon.appendChild(document.createTextNode('expand_more'));
      down_vote_icon_div.appendChild(down_vote_icon);
      // select which arrow apper
      if (Number(localStorage.logged_in) === 1){ // logged in
        let user_id_div = document.getElementById("user-id-id");
        let user_id = user_id_div.textContent;
        if (posts[i].meta.upvotes.includes(Number(user_id))){
          // has voted should show down icon
          up_vote_icon.classList.add("material-icons", "my-vote-disable");
          down_vote_icon_div.className = "vote-icon-hover-below";
          down_vote_icon.classList.add("material-icons", "my-vote");
          // downVote function
          down_vote_icon.addEventListener("click", downVote);
        } else {
          //has not voted should show up-icon
          up_vote_icon.classList.add("material-icons", "my-vote");
          up_vote_icon_div.className = "vote-icon-hover";
          down_vote_icon.classList.add("material-icons", "my-vote-disable");
          // downVote function
          up_vote_icon.addEventListener("click", upVote);
        }
      } else { // not logged in both icons should be shown
        up_vote_icon_div.className = "vote-icon-hover";
        up_vote_icon.classList.add("material-icons", "my-vote");
        up_vote_icon.addEventListener("click", upVote);
        down_vote_icon_div.className = "vote-icon-hover-below";
        down_vote_icon.classList.add("material-icons", "my-vote");
        down_vote_icon.addEventListener("click", downVote);
      }

      // append three elements
      vote_div.appendChild(up_vote_icon_div);
      vote_div.appendChild(vote_num_div);
      vote_div.appendChild(down_vote_icon_div);
      // create content elem
      var content_div = document.createElement('div');
      content_div.className = "content";
      new_li.appendChild(content_div);
      // make contents inside content div
      // make meta info div
      var post_meta = document.createElement('div');
      post_meta.className = 'post-meta';
      content_div.appendChild(post_meta);
      // suddit in meta 
      var post_suddit = document.createElement('p');
      post_suddit.className = 'post-suddit';
      post_suddit.appendChild(document.createTextNode('r/' +posts[i].meta.subseddit + ' \u2022'));
      // author in meta
      var author_hover = document.createElement('div');
      author_hover.className = 'author-hover';
      author_hover.addEventListener("click", showUserPage);
      var post_author = document.createElement('p');
      post_author.setAttribute('data-id-author','');
      post_author.className = 'post-in-meta';
      post_author.appendChild(document.createTextNode('@' + posts[i].meta.author));
      author_hover.appendChild(post_author);
      // time in meta
      var post_time = document.createElement('p');
      post_time.className = 'post-in-meta';
      post_time.appendChild(document.createTextNode('At ' + convertToDate(posts[i].meta.published)));
      // add suddit, author, time into meta div
      post_meta.appendChild(post_suddit);
      post_meta.appendChild(author_hover);
      post_meta.appendChild(post_time);
      // create title 
      var post_title = document.createElement('h4');
      post_title.setAttribute('data-id-title','');
      post_title.classList.add("post-title", "alt-text");
      post_title.appendChild(document.createTextNode(posts[i].title));
      content_div.appendChild(post_title);
      // create text
      var post_text = document.createElement('div');
      post_text.className = "post-text";
      post_text.appendChild(document.createTextNode(posts[i].text));
      content_div.appendChild(post_text);
      // create img
      if (posts[i].image !== null){
        var post_img = document.createElement("img");
        post_img.src = 'data:image/jpeg;base64,' + posts[i].image;
        // post_img.className = 'post-img';
        content_div.appendChild(post_img);
      }
      // create reply form
      var reply_form = document.createElement('form');
      reply_form.style.display = 'flex'
      var reply_input = document.createElement("input");
      reply_input.placeholder = "write your comment";
      reply_input.type = "text";
      reply_input.className = 'reply';
      var reply_btn = document.createElement("input");
      reply_btn.className = 'replybtn';
      reply_btn.type = "submit";
      reply_btn.value = "Reply";
      reply_form.appendChild(reply_input);
      reply_form.appendChild(reply_btn);
      content_div.appendChild(reply_form);
      reply_form.addEventListener("submit", sentReply);
      // create comment
      var post_comment = document.createElement('div');
      post_comment.className = 'post-comment';
      content_div.appendChild(post_comment);
      var post_hover = document.createElement('div');
      post_hover.className = "post-hover";
      post_comment.appendChild(post_hover);
      // create icon and text inside comment div
      var comment_icon = document.createElement('i');
      comment_icon.classList.add("material-icons", "my-icon-comment");
      comment_icon.appendChild(document.createTextNode('mode_comment'));
      post_hover.appendChild(comment_icon);
      var  comment_text = document.createElement('p');
      comment_text.appendChild(document.createTextNode(posts[i].comments.length + ' comments'))
      post_hover.appendChild(comment_text);
      post_hover.addEventListener("click", showComments);
    }
    return posts.length;
  });

  if (Number(localStorage.logged_in) === 1){ // logged in
    posts_length.then(function(length){
      // set last posts
      localStorage.last_posts = Number(localStorage.last_posts) + length;
    });
  }
}

function upVote(){
  // check auth
  if (Number(localStorage.logged_in) === 0){
    alert("Please log in first to use this features");
    return;
  }

  // make up_vote cannot be click 
  this.removeEventListener("click", upVote);
  this.classList.remove('my-vote');
  this.classList.add('my-vote-disable');
  this.parentElement.className = '';

  // make down_vote can be click
  this.parentElement.parentElement.children[2].children[0].addEventListener("click", downVote);
  this.parentElement.parentElement.children[2].children[0].classList.remove('my-vote-disable');
  this.parentElement.parentElement.children[2].children[0].classList.add('my-vote');
  this.parentElement.parentElement.children[2].className = "vote-icon-hover-below";

  const post_id = this.parentElement.parentElement.parentElement.children[0].innerHTML;
  // fetch the a post by id
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
  
  const data = {
    "method" : 'PUT',
    "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
    }
   };
  
  const curr_div = this;
  // fetch the post vote
  fetch("http://127.0.0.1:5000/post/vote?id=" + post_id, data)
    .then(function(response){
      if (response.status === 200) {
        // get new votes from backend
        // changed the request method
        data.method = "GET";
        // fetch the personal post from backend
        fetch("http://127.0.0.1:5000/post/?id=" + post_id, data)
          .then(response => response.json())
          .then(post => post.meta.upvotes)
          .then(function(upVotes){
            curr_div.parentElement.parentElement.children[1].children[0].textContent = upVotes.length;
          });
      }
    });
}

function downVote(){
  // check auth
  if (Number(localStorage.logged_in) === 0){
    alert("Please log in first to use this features");
    return;
  }

  // make down cannot be click 
  this.removeEventListener("click", downVote);
  this.classList.remove('my-vote');
  this.classList.add('my-vote-disable');
  this.parentElement.className = '';

  // make up_vote can be click
  this.parentElement.parentElement.children[0].children[0].addEventListener("click", upVote);
  this.parentElement.parentElement.children[0].children[0].classList.remove('my-vote-disable');
  this.parentElement.parentElement.children[0].children[0].classList.add('my-vote');
  this.parentElement.parentElement.children[0].className = "vote-icon-hover";

  const post_id = this.parentElement.parentElement.parentElement.children[0].innerHTML;
  // fetch the a post by id
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;

  const data = {
    "method" : 'DELETE',
    "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
    }
  };
  
  const curr_div = this;
  // fetch the post vote
  fetch("http://127.0.0.1:5000/post/vote?id=" + post_id, data)
    .then(function(response){
      if (response.status === 200) {
        // get new votes from backend
        // changed the request method
        data.method = "GET";
        // fetch the personal post from backend
        fetch("http://127.0.0.1:5000/post/?id=" + post_id, data)
          .then(response => response.json())
          .then(post => post.meta.upvotes)
          .then(function(upVotes){
            curr_div.parentElement.parentElement.children[1].children[0].textContent = upVotes.length;
          });
      }
    });
}

function showUpVotes(){
  // check auth
  if (Number(localStorage.logged_in) === 0){
    alert("Please log in first to use this features");
    return;
  }

  const post_id = this.parentElement.parentElement.parentElement.children[0].innerHTML;
  // fetch the a post by id
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
  
  const data = {
    "method" : 'GET',
    "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
    }
   };

  // fetch the personal post from backend
  const promise_upvotes = fetch("http://127.0.0.1:5000/post/?id=" + post_id, data)
    .then(response => response.json())
    .then(post => post.meta.upvotes);
  
  // scroll to the location
  window.scrollBy(0,getOffset(this).top-100);

  // stop scrolling
  document.body.classList.add('stop-scrolling');

  let root_div = document.getElementById("root"); 
  // create logIn_modal_div; the jump out window
  var upVotes_modal_div = document.createElement("div");
  upVotes_modal_div.id = "upVotesModal";
  upVotes_modal_div.className = "upVotes-modal";
  root_div.appendChild(upVotes_modal_div);
  // create the content inside modal
  var upVotes_content = document.createElement("div");
  upVotes_content.className = "upVotes-modal-content";
  upVotes_content.style.top = `120px`;
  upVotes_modal_div.appendChild(upVotes_content);
  // create element inside window
  // create span
  var upVotes_span = document.createElement("span");
  upVotes_span.className = "upVotes-close";
  upVotes_span.appendChild(document.createTextNode("\xD7"));
  // click span to quit from logIn modal
  upVotes_span.onclick = function() {
    root_div.removeChild(upVotes_modal_div);
    document.body.classList.remove('stop-scrolling');
  }
  upVotes_content.appendChild(upVotes_span);
  // create upvotes title
  // create upvotes div
  var upVotes_title = document.createElement("div");
  upVotes_title.style.margin = "20px 20px";
  upVotes_title.appendChild(document.createTextNode("Upvoted User"));
  upVotes_content.appendChild(upVotes_title);

  // fetch the users
  promise_upvotes.then(function(upVotes){
    for (var i = 0; i < upVotes.length; i++) {
      fetch("http://127.0.0.1:5000/user/?id=" + upVotes[i], data)
        .then(response => response.json())
        .then(user => user.username)
        .then(function(username){
          var user_div = document.createElement("div");
          user_div.className = "user-div";
          user_div.appendChild(document.createTextNode(username));
          upVotes_content.appendChild(user_div);
        });
    }
  });
}

function showComments() {
  // check auth
  if (Number(localStorage.logged_in) === 0){
    alert("Please log in first to use this features");
    return;
  }

  var post = this.parentElement.parentElement;
  // check open or close
  var post_lenght = post.children.length;
  if (post.children[post_lenght-1].className !== "post-comment"){ // comment window already opened
    post.removeChild(post.children[post_lenght-1]);
    return;
  }
  // var a = this.children;
  // console.log(a[1].childNodes[0].nodeValue);
  // if (this.children[1].childNodes[0].nodeValue === "0 comments"){
  //   return;
  // }
  
  if (this.children[1].textContent === "0 comments"){
    return;
  }

  const post_id = this.parentElement.parentElement.parentElement.children[0].innerHTML;
  // fetch the a post by id
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
    
  const data = {
    "method" : 'GET',
    "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
    }
  };
  
  // fetch the post from backend
  const promise_comments = fetch("http://127.0.0.1:5000/post/?id=" + post_id, data)
    .then(response => response.json())
    .then(post => post.comments);

/*
  let root_div = document.getElementById("root"); 
  // create comments_modal_div; the jump out window
  var comments_modal_div = document.createElement("div");
  comments_modal_div.className = "comments-modal";
  root_div.appendChild(comments_modal_div);
*/
  // create the content inside modal
  var comments_content = document.createElement("div");
  comments_content.className = "comments-modal-content";
  post.appendChild(comments_content);
  // create element inside window
  // create comments_div
  var comments_div = document.createElement("div");
  comments_div.className = "comments";
  comments_content.appendChild(comments_div);
  // create comments title
  var comments_title = document.createElement("div");
  comments_title.className = "commentsHead"
  comments_title.appendChild(document.createTextNode("Comments"));
  comments_div.appendChild(comments_title);

  promise_comments.then(function(comments){
    // create comment
    for (var i = 0; i < comments.length; i++) { 
      var comment_div = document.createElement('div');
      comment_div.className = "comment";
      comments_div.appendChild(comment_div);
      // create outer_div 
      var outer_div = document.createElement('div');
      outer_div.className = "comment-outer";
      comment_div.append(outer_div)
      // create user who write comment:
      var author_hover = document.createElement('div');
      author_hover.className = 'author-hover';
      author_hover.addEventListener("click", showUserPage);
      var comment_author = document.createElement('div');
      comment_author.className = "comment-author";
      comment_author.appendChild(document.createTextNode("@" + comments[i].author))
      author_hover.appendChild(comment_author);
      outer_div.appendChild(author_hover);
      // create text of comment
      var comment_text = document.createElement('div');
      comment_text.className = "comment-text";
      comment_text.appendChild(document.createTextNode(comments[i].comment))
      outer_div.appendChild(comment_text);
      // create time of comment
      var comment_time = document.createElement('div');
      comment_time.className = "comment-time";
      comment_time.appendChild(document.createTextNode("At " + convertToDate(comments[i].published)))
      comment_div.appendChild(comment_time);
    }
  });
}

function sentReply() {
  event.preventDefault();
  // check auth
  if (Number(localStorage.logged_in) === 0){
    alert("Please log in first to use this features");
    return;
  }
  const comment_text = this.children[0].value;
  if (comment_text === '' ){
    alert('comment is empty');
  } else {
    const payload = {
      "comment": `${comment_text}`,
    };
    // var data = new FormData();
    // data.append("json", JSON.stringify(payload));
    const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
    const post_id = this.parentElement.parentElement.children[0].innerHTML;
    const data = {
      "method" : 'PUT',
      "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
      },
      "body" : JSON.stringify(payload)
    };
    const loc_elem = this;
    var response = fetch("http://127.0.0.1:5000/post/comment?id=" + post_id, data);
    response.then(function(response) {
      if (response.status === 200) {
        const data = {
          "method" : 'GET',
          "headers" : {
              "Content-Type": "application/json",
              "Authorization" : 'Token: ' + token_code
          }
        };
        const comments_num = fetch("http://127.0.0.1:5000/post/?id=" + post_id, data)
          .then(response => response.json())
          .then(post => post.comments.length);
        
        comments_num.then(function(length){
          const posts_len = loc_elem.parentElement.children.length
          loc_elem.parentElement.children[posts_len-1].children[0].children[1].innerHTML = length + ' comments';
          loc_elem.children[0].value = '';
        });
      } 
    });
  }
}

function postBtn(){
  let root_div = document.getElementById("root");
  // create new_post_modal; the jump out window
  var new_post_modal_div = document.createElement("div");
  new_post_modal_div.id = "new-post-modal";
  new_post_modal_div.className = "modal";
  new_post_modal_div.style.display = 'block';
  root_div.appendChild(new_post_modal_div);
  // create the content inside modal
  var new_post_content = document.createElement("div");
  new_post_content.className = "modal-content";
  new_post_modal_div.appendChild(new_post_content);
  // create element(form) inside window
  // create span
  var new_post_span = document.createElement("span");
  new_post_span.className = "close";
  new_post_span.appendChild(document.createTextNode("\xD7"));
  // click span to quit from post modal
  new_post_span.onclick = function() {
    root_div.removeChild(new_post_modal_div);
  }
  new_post_content.appendChild(new_post_span);
  // create post form
  var new_post_form = document.createElement("form");
  new_post_form.className = "form";
  new_post_form.name = "new-post";
  new_post_content.appendChild(new_post_form);
  // create content inside new post form
  var new_post_head = document.createElement("div");
  new_post_head.className = "formHead";
  new_post_head.appendChild(document.createTextNode("NEW POST"));
  new_post_form.appendChild(new_post_head);
  // post title label
  var post_title_label = document.createElement("label");
  post_title_label.className = "formLabel";
  post_title_label.appendChild(document.createTextNode("Title:"))
  // post title filed
  var post_title_input = document.createElement("input");
  post_title_input.placeholder = "Please insert the title of post";
  post_title_input.type = "text";
  post_title_input.name = "title";
  // post content label
  var post_content_label = document.createElement("label");
  post_content_label.className = "formLabel";
  post_content_label.appendChild(document.createTextNode("Content:"));
  //  post content  filed
  var post_content_input = document.createElement("textarea");
  post_content_input.className = "new-post-content";
  // post_content_input.placeholder = "write your...";
  post_content_input.name = "content";
  // img upload part
  var img_upload = document.createElement("input");
  img_upload.type = 'file';
  img_upload.addEventListener("change", readFile);
  // img_upload.value = 'upload img'
  var img_holder = document.createElement('img')
  img_holder.id = 'img_new_post';
  img_holder.className = 'input-img' 
  var b64_holder = document.createElement('p');
  b64_holder.id = 'img_b64';
  b64_holder.style.display = "none";
  // add change function of img upload
  addEventListener("change", readFile);
  // warning text
  var warning_text = document.createElement('div');
  warning_text.className = 'input-warning';
  warning_text.appendChild(document.createTextNode('anything'));
  // submit button
  var submit_btn = document.createElement("input");
  submit_btn.type = "submit";
  submit_btn.name = "Login";
  submit_btn.value = 'submit';
  // add elements to new content form
  submit_btn.appendChild(document.createTextNode("Submit"));
  new_post_form.appendChild(post_title_label);
  new_post_form.appendChild(post_title_input);
  new_post_form.appendChild(post_content_label);
  new_post_form.appendChild(post_content_input);
  new_post_form.appendChild(img_upload);
  new_post_form.appendChild(img_holder);
  new_post_form.appendChild(b64_holder);
  new_post_form.appendChild(warning_text);
  new_post_form.appendChild(submit_btn);

  new_post_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = new_post_form.elements.title.value;
    const content = new_post_form.elements.content.value;
    var b64_img = b64_holder.innerHTML;
    if (b64_img == '') {
      b64_img = null;
    } else {
      b64_img = b64_img.slice(22);
    } 
    if (title === '' || content === ''){
      warning_text.textContent = "title and content field cannot be empty";
      warning_text.style.display = "block";
    } else {
      // get auth
      const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
      
      const payload = {
        "title": `${title}`,
        "text": `${content}`,
        "subseddit": "",
        "image": `${b64_img}`
      };

      const data = {
        "method" : 'POST',
        "headers" : {
            "Content-Type": "application/json",
            "Authorization" : 'Token: ' + token_code
        },
        "body" : JSON.stringify(payload)
      };
      var response = fetch("http://127.0.0.1:5000/post/", data);
      // check Authentication
      response.then(function(response) {
        if (response.status === 200) {
          location.reload();
        }
      });
    }
  }); 
}

function showUserPage() {
  // check auth
  if (Number(localStorage.logged_in) === 0){
    alert("Please log in first to use this features");
    return;
  }

  let root_div = document.getElementById("root");
  var name = this.children[0].innerHTML;
  name = name.slice(1);

  if (name === document.getElementById("my-name").innerHTML){
    alert("that your name bro");
    return;
  }
  // create profile_modal_div; the jump out window
  var profile_modal_div = document.createElement("div");
  profile_modal_div.id = "profileModal";
  profile_modal_div.className = "modal-user-page";
  profile_modal_div.style.display = 'block';
  root_div.appendChild(profile_modal_div);
  // create the content inside modal
  var profile_content = document.createElement("div");
  profile_content.className = "modal-content-user-page";
  profile_modal_div.appendChild(profile_content);
  // create element(form) inside window
  // create span
  var profile_span = document.createElement("span");
  profile_span.className = "close";
  profile_span.appendChild(document.createTextNode("\xD7"));
  // click span to quit from logIn modal
  profile_span.onclick = function() {
    root_div.removeChild(profile_modal_div);
  }
  profile_content.appendChild(profile_span);
  // create profile form
  var profile_form = document.createElement("div");
  profile_form.className = "profile";
  profile_content.appendChild(profile_form);
  // create content inside profile form
  var profile_top_div = document.createElement("div");
  var profile_head = document.createElement("div");
  profile_head.className = "profileHead";
  profile_head.appendChild(document.createTextNode(name + "'s PROFILE"));
  profile_top_div.appendChild(profile_head);
  // create Profile 
  var update_profile_button = document.createElement("button");
  update_profile_button.className = "button button-primary";
  update_profile_button.appendChild(document.createTextNode("Follow"));
  update_profile_button.addEventListener("click", upDateProfileBtn); 
  profile_top_div.appendChild(update_profile_button);
  profile_form.appendChild(profile_top_div);
  
  // fetch the user info form backend 
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;

  const data = {
    "method" : 'GET',
    "headers" : {
      "Content-Type": "application/json",
      "Authorization" : 'Token: ' + token_code
    }
  };

  const posts = fetch("http://127.0.0.1:5000/user/?username=" + name, data)
    .then(response => response.json())
    .then(function(user_info){
      var user_id = document.createElement("div");
      user_id.id = "user-id-id"
      user_id.style.display = 'none';
      user_id.appendChild(document.createTextNode(user_info.id));
      profile_form.appendChild(user_id);
      createUserProfile(profile_form, user_info);
      return user_info.posts;
    });
  // create user's posts
  posts.then(function(posts){
    // create user's posts head
    var post_head = document.createElement("div");
    post_head.style.margin = '10px';
    post_head.appendChild(document.createTextNode(name + "'s POST"));
    profile_content.appendChild(post_head);
    createUserPost(profile_content, posts);
  });
}

function createPersonalPageModel(root_div) {
  // create profile_modal_div; the jump out window
  var profile_modal_div = document.createElement("div");
  profile_modal_div.id = "profileModal";
  profile_modal_div.className = "modal-user-page";
  root_div.appendChild(profile_modal_div);
  // create the content inside modal
  var profile_content = document.createElement("div");
  profile_content.className = "modal-content-user-page";
  profile_modal_div.appendChild(profile_content);
  // create element(form) inside window
  // create span
  var profile_span = document.createElement("span");
  profile_span.className = "close";
  profile_span.appendChild(document.createTextNode("\xD7"));
  // click span to quit from logIn modal
  profile_span.onclick = function() {
    profile_modal_div.style.display = 'none';
  }
  profile_content.appendChild(profile_span);
  // create profile form
  var profile_form = document.createElement("div");
  profile_form.className = "profile";
  profile_content.appendChild(profile_form);
  // create content inside profile form
  var profile_top_div = document.createElement("div");
  var profile_head = document.createElement("div");
  profile_head.className = "profileHead";
  profile_head.appendChild(document.createTextNode("MY PROFILE"));
  profile_top_div.appendChild(profile_head);
  // create Profile 
  var update_profile_button = document.createElement("button");
  update_profile_button.className = "button button-secondary";
  update_profile_button.appendChild(document.createTextNode("edit profile"));
  update_profile_button.addEventListener("click", upDateProfileBtn); 
  profile_top_div.appendChild(update_profile_button);
  profile_form.appendChild(profile_top_div);
  
  // fetch the user info form backend 
  const token_code = JSON.parse(localStorage.getItem('usertoken')).token;

  const data = {
    "method" : 'GET',
    "headers" : {
      "Content-Type": "application/json",
      "Authorization" : 'Token: ' + token_code
    }
  };

  const posts = fetch("http://127.0.0.1:5000/user/", data)
    .then(response => response.json())
    .then(function(user_info){
      var user_id = document.createElement("div");
      user_id.id = "user-id-id"
      user_id.style.display = 'none';
      user_id.appendChild(document.createTextNode(user_info.id));
      profile_form.appendChild(user_id);
      createUserProfile(profile_form, user_info);
      return user_info.posts;
    });
  // create user's posts
  posts.then(function(posts){
    // create user's posts head
    var post_head = document.createElement("div");
    post_head.style.margin = '10px';
    post_head.appendChild(document.createTextNode("MY POSTS"));
    profile_content.appendChild(post_head);
    createUserPost(profile_content, posts);
  });
}

function createUserProfile(profile_form, user_info) {
  // create user_names
  var username_div = document.createElement("div");
  var username_tag = document.createElement("div");
  username_tag.appendChild(document.createTextNode("Username:"))
  username_tag.className = "profile-tag";
  var username_value = document.createElement("div");
  username_value.id = 'my-name';
  username_value.appendChild(document.createTextNode("   " + user_info.username))
  username_div.appendChild(username_tag)
  username_div.appendChild(username_value)
  profile_form.appendChild(username_div)
  // create name
  var name_div = document.createElement("div");
  var name_tag = document.createElement("div");
  name_tag.appendChild(document.createTextNode("Name:"))
  name_tag.className = "profile-tag";
  var name_value = document.createElement("div");
  name_value.appendChild(document.createTextNode("   " + user_info.name))
  name_div.appendChild(name_tag)
  name_div.appendChild(name_value)
  profile_form.appendChild(name_div)
  // create e-mail
  var mail_div = document.createElement("div");
  var mail_tag = document.createElement("div");
  mail_tag.appendChild(document.createTextNode("E-mail:"))
  mail_tag.className = "profile-tag";
  var mail_value = document.createElement("div");
  mail_value.appendChild(document.createTextNode("   " + user_info.email))
  mail_div.appendChild(mail_tag)
  mail_div.appendChild(mail_value)
  profile_form.appendChild(mail_div)
  // create following_num
  var following_div = document.createElement("div");
  var following_tag = document.createElement("div");
  following_tag.appendChild(document.createTextNode("Following:"))
  following_tag.className = "profile-tag";
  var following_value = document.createElement("div");
  following_value.appendChild(document.createTextNode("   " + user_info.following.length))
  following_div.appendChild(following_tag)
  following_div.appendChild(following_value)
  profile_form.appendChild(following_div)
  // create followed_num
  var followed_div = document.createElement("div");
  var followed_tag = document.createElement("div");
  followed_tag.appendChild(document.createTextNode("Followed:"))
  followed_tag.className = "profile-tag";
  var followed_value = document.createElement("div");
  followed_value.appendChild(document.createTextNode("   " + user_info.followed_num))
  followed_div.appendChild(followed_tag)
  followed_div.appendChild(followed_value)
  profile_form.appendChild(followed_div)
  // create followed_num
  var post_num_div = document.createElement("div");
  var post_num_tag = document.createElement("div");
  post_num_tag.appendChild(document.createTextNode("Posts:"))
  post_num_tag.className = "profile-tag";
  var post_num_value = document.createElement("div");
  post_num_value.appendChild(document.createTextNode("   " + user_info.posts.length));
  post_num_div.appendChild(post_num_tag);
  post_num_div.appendChild(post_num_value);
  profile_form.appendChild(post_num_div);
}

function createUserPost(profile_content, posts) {
  // create post ul div
  var ul_posts = document.createElement("ul");
  ul_posts.className = 'ul-posts';
  profile_content.appendChild(ul_posts);
  for (var i = 0; i < posts.length; i++) {
    // fetch the a post by id
    const token_code = JSON.parse(localStorage.getItem('usertoken')).token;    
    const data = {
      "method" : 'GET',
      "headers" : {
        "Content-Type": "application/json",
        "Authorization" : 'Token: ' + token_code
        }
      };
        
    fetch("http://127.0.0.1:5000/post/?id=" + posts[i], data)
    .then(response => response.json())
    .then(function(post){
      // create post li
      var new_li = document.createElement("li");
      new_li.className = "post";
      ul_posts.appendChild(new_li);
      // create a 'p' to store the id of post
      var id_p = document.createElement("p");
      id_p.appendChild(document.createTextNode(post.id));
      id_p.style.display = 'none';
      new_li.appendChild(id_p);
      // create vote elem
      var vote_div = document.createElement('div');
      vote_div.className = "vote";
      new_li.appendChild(vote_div);
      // create up_vote_icon
      var up_vote_icon_div = document.createElement('div');
      var up_vote_icon = document.createElement('i');
      up_vote_icon.appendChild(document.createTextNode('expand_less'));
      up_vote_icon_div.appendChild(up_vote_icon);
      // create vote_number
      var vote_num_div = document.createElement('div');
      vote_num_div.className = "vote-num-hover";
      var vote_num = document.createElement('p');
      vote_num.className = "vote-num";
      vote_num.appendChild(document.createTextNode(post.meta.upvotes.length));
      vote_num_div.appendChild(vote_num);
      // get show upVotes function
      vote_num.addEventListener("click", showUpVotes);
      // create down_vote_icon
      var down_vote_icon_div = document.createElement('div');
      var down_vote_icon = document.createElement('i');
      down_vote_icon.appendChild(document.createTextNode('expand_more'));
      down_vote_icon_div.appendChild(down_vote_icon);
      // select which arrow apper
      let user_id_div = document.getElementById("user-id-id");
      let user_id = user_id_div.textContent;
      if (post.meta.upvotes.includes(Number(user_id))){
        // has voted should show down icon
        up_vote_icon.classList.add("material-icons", "my-vote-disable");
        down_vote_icon_div.className = "vote-icon-hover-below";
        down_vote_icon.classList.add("material-icons", "my-vote");
        // downVote function
        down_vote_icon.addEventListener("click", downVote);
      } else {
        //has not voted should show up-icon
        up_vote_icon.classList.add("material-icons", "my-vote");
        up_vote_icon_div.className = "vote-icon-hover";
        down_vote_icon.classList.add("material-icons", "my-vote-disable");
        // downVote function
        up_vote_icon.addEventListener("click", upVote);
      }
      // append three elements
      vote_div.appendChild(up_vote_icon_div);
      vote_div.appendChild(vote_num_div);
      vote_div.appendChild(down_vote_icon_div);
      // create content elem
      var content_div = document.createElement('div');
      content_div.className = "content";
      new_li.appendChild(content_div);
      // make contents inside content div
      // make meta info div
      var post_meta = document.createElement('div');
      post_meta.className = 'post-meta';
      content_div.appendChild(post_meta);
      // suddit in meta 
      var post_suddit = document.createElement('p');
      post_suddit.className = 'post-suddit';
      post_suddit.appendChild(document.createTextNode('r/' +post.meta.subseddit + ' \u2022'));
      // author in meta
      var post_author = document.createElement('p');
      post_author.setAttribute('data-id-author','');
      post_author.className = 'post-in-meta';
      post_author.appendChild(document.createTextNode('Posted by @' + post.meta.author));
      // time in meta
      var post_time = document.createElement('p');
      post_time.className = 'post-in-meta';
      post_time.appendChild(document.createTextNode('At ' + convertToDate(post.meta.published)));
      // add suddit, author, time into meta div
      post_meta.appendChild(post_suddit);
      post_meta.appendChild(post_author);
      post_meta.appendChild(post_time);
      // create title 
      var post_title = document.createElement('h4');
      post_title.setAttribute('data-id-title','');
      post_title.classList.add("post-title", "alt-text");
      post_title.appendChild(document.createTextNode(post.title));
      content_div.appendChild(post_title);
      // create text
      var post_text = document.createElement('div');
      post_text.className = "post-text";
      post_text.appendChild(document.createTextNode(post.text));
      content_div.appendChild(post_text);
      // create img
      if (post.image !== null){
        var post_img = document.createElement("img");
        post_img.src = 'data:image/jpeg;base64,' + post.image;
        // post_img.className = 'post-img';
        content_div.appendChild(post_img);
      }
      // create comment
      var post_comment = document.createElement('div');
      post_comment.className = 'post-comment';
      content_div.appendChild(post_comment);
      var post_hover = document.createElement('div');
      post_hover.className = "post-hover";
      post_comment.appendChild(post_hover);
      // create icon and text inside comment div
      var comment_icon = document.createElement('i');
      comment_icon.classList.add("material-icons", "my-icon-comment");
      comment_icon.appendChild(document.createTextNode('mode_comment'));
      post_hover.appendChild(comment_icon);
      var  comment_text = document.createElement('p');
      comment_text.appendChild(document.createTextNode(post.comments.length + ' comments'))
      post_hover.appendChild(comment_text);
      post_hover.addEventListener("click", showComments);
    });          
  }
}

function upDateProfileBtn() {
  console.log('update');
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top
  };
}

function convertToDate(utcSeconds) {
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);  
  var str = '';
  var months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"];
  str += d.getHours() + ':' + d.getMinutes() + ', ' + d.getDate() + '/' + months[d.getMonth()];
  return str;
}

function readFile() {
  if (this.files && this.files[0]) {
    var FR= new FileReader();
    FR.addEventListener("load", function(e) {
      document.getElementById("img_new_post").src = e.target.result;
      document.getElementById("img_b64").appendChild(document.createTextNode(e.target.result));
    }); 
    FR.readAsDataURL(this.files[0]);
  } else {
    document.getElementById("img_new_post").src = '';
    document.getElementById("img_b64").innerHTML = '';
  }
}

document.addEventListener('scroll', function (event) {
  // console.log('total' + document.body.scrollHeight);
  // console.log('top' + document.documentElement.scrollTop);
  // console.log('window' + window.innerHeight);
  if (document.body.scrollHeight <= document.documentElement.scrollTop + window.innerHeight +1) {
    if (Number(localStorage.logged_in) === 1){ // logged in
      // fetch more user's post from backend
      const token_code = JSON.parse(localStorage.getItem('usertoken')).token;
      var last_posts = Number(localStorage.last_posts);

      const data = {
        "method" : 'GET',
        "headers" : {
            "Content-Type": "application/json",
            "Authorization" : 'Token: ' + token_code
        }
      };

      // fetch the personal post from backend
      const promise_posts = fetch("http://127.0.0.1:5000/user/feed?p=" + last_posts +'&n=1', data)
        .then(response => response.json())
        .then(myJson => myJson.posts);
      
        let ul_feed = document.getElementById("feed");
      // create the posts by personl promise fetched from backend
      createPosts(promise_posts, ul_feed);
    }
  }
});

export default createFeed;
