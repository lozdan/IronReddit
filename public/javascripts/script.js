$(document).ready(() => {
    $(".single-thread").click(function () {
        $(".posts").empty();
        const tId = $(this).data('id');

        $.getJSON(`/thread/${tId}/posts`, res => {
            res.forEach(post => {
                $('.posts').append(
                    `
                    <h1>${post.title}</h1>
                    <p class="vote-count-${post._id}">${post.votes}</p>
                    <button class="upvote" id=${post._id}>Upvote</button>
                    `
                )
            })
        })

            .promise().done(function () {
                $(".upvote").click(function () {
                    const postId = this.id;
                    $.getJSON(`/post/${postId}/upvote`, vote => {
                        $(`.vote-count-${postId}`).text(vote);
                    })

                })
            })
    })

});
