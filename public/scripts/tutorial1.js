var data = [
	{id: 1, author: "Mauricio Melo", text: "Eu sou o Mauricio."},
	{id: 2, author: "Raony Lima", text: "Eu sou o Raony."},
];


var CommentBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval)
	},
	
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		}	
		);
	},
	
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList  data={this.state.data}/>
				<CommentForm />
			</div>
			);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return {__html: rawMarkup};
	},
	
	render: function() {
		return (
					<div className="comment">
						<h2 className="commentAuthor">
							{this.props.author}
						</h2>
						<span dangerouslySetInnerHTML = {this.rawMarkup()} />
					</div>
		);
	}
});

var CommentForm = React.createClass({
	getInitialState: function() {
		return {author: '', text: ''};
	},
	
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value});
	},
	
	handleTextChange: function(e) {
		this.setState({text: e.target.value});
	},
	
	render: function() {
	 return (
				<form className="commentForm">
					<input 
		 				type="text" 
		 				placeholder="Your name" 
		 				value={this.state.author}
		 				onChange={this.handleAuthorChange}
		 			/>
					<input 
		 				type="text" 
		 				placeholder="Say something..." 
		 				value={this.state.text}
		 				onChange={this.handleTextChange}
		 			/>
					<input type="submit" value="Post" />
				</form>
			);
	}
});

ReactDOM.render(
	<CommentBox url="/api/comments" pollInterval={2000}/>,
	document.getElementById('content')
);