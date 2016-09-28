'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogIn = function (_React$Component) {
  _inherits(LogIn, _React$Component);

  function LogIn(props) {
    _classCallCheck(this, LogIn);

    var _this = _possibleConstructorReturn(this, (LogIn.__proto__ || Object.getPrototypeOf(LogIn)).call(this, props));

    _this.state = {
      username: '',
      password: '',
      errorMsg: ''
    };
    return _this;
  }

  _createClass(LogIn, [{
    key: 'handleChange',
    value: function handleChange(event) {
      var tar = event.target.value;
      if (event.target.name === 'LogInName') {
        this.setState({
          username: tar
        });
      } else {
        this.setState({
          password: tar
        });
      }
    }
  }, {
    key: 'handleLogIn',
    value: function handleLogIn() {
      var _this2 = this;

      if (!this.state.username.length && !this.state.password.length) {
        this.setState({
          errorMsg: 'login is empty'
        });
      } else if (!this.state.username.length) {
        this.setState({
          errorMsg: 'please enter a username'
        });
      } else if (!this.state.password.length) {
        this.setState({
          errorMsg: 'please enter a password'
        });
      } else {
        var userObj = {
          name: this.state.username,
          password: this.state.password
        };

        $.post(Url + '/login', userObj).then(function (response) {
          if (response[0] === 'it worked') {
            // console.log('hi');

            _this2.setState({
              errorMsg: ''
            });

            _this2.props.changeViews('Home');
            _this2.props.setCurrentUser(response[1]);
          }
          // console.log('this.state.view after state is set again',this.state.view);
        }).catch(function (err) {
          // console.log(err);
          _this2.setState({
            errorMsg: 'invalid login information'
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { className: 'landing row' },
        React.createElement(
          'div',
          { className: 'icon-block col s7' },
          React.createElement(
            'h2',
            { className: 'header logo' },
            'Welcome to ReelPals'
          ),
          React.createElement(
            'h5',
            { className: 'header col s12 light description' },
            'Let\'s find your next buddy by your movie taste!'
          )
        ),
        React.createElement(
          'div',
          { className: 'login icon-block' },
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this3.props.changeViews('SignUp');
              } },
            'Go to Sign Up'
          ),
          React.createElement(
            'div',
            { className: 'or' },
            'OR'
          ),
          React.createElement(
            'div',
            { className: 'loginForm' },
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'username', id: 'user_name', name: 'LogInName', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { htmlFor: 'user_name', className: 'active' },
                'Username'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'password', id: 'password', name: 'LogInPassword', type: 'password', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { htmlFor: 'password', className: 'active' },
                'Password'
              )
            ),
            React.createElement(
              'div',
              { className: 'errorMsg' },
              this.state.errorMsg
            ),
            React.createElement(
              'a',
              { className: 'waves-effect waves-light btn', onClick: this.handleLogIn.bind(this) },
              'log in'
            )
          )
        )
      );
    }
  }]);

  return LogIn;
}(React.Component);

window.LogIn = LogIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbIkxvZ0luIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlcnJvck1zZyIsImV2ZW50IiwidGFyIiwidGFyZ2V0IiwidmFsdWUiLCJuYW1lIiwic2V0U3RhdGUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcG9uc2UiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiY2F0Y2giLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlTG9nSW4iLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxLOzs7QUFFSixpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVUsRUFEQztBQUVYQyxnQkFBVSxFQUZDO0FBR1hDLGdCQUFVO0FBSEMsS0FBYjtBQUhpQjtBQVFsQjs7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFVBQU1DLE1BQU1ELE1BQU1FLE1BQU4sQ0FBYUMsS0FBekI7QUFDQSxVQUFJSCxNQUFNRSxNQUFOLENBQWFFLElBQWIsS0FBc0IsV0FBMUIsRUFBdUM7QUFDckMsYUFBS0MsUUFBTCxDQUFjO0FBQ1pSLG9CQUFVSTtBQURFLFNBQWQ7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLSSxRQUFMLENBQWM7QUFDWlAsb0JBQVVHO0FBREUsU0FBZDtBQUdEO0FBQ0Y7OztrQ0FFYTtBQUFBOztBQUNaLFVBQUksQ0FBQyxLQUFLTCxLQUFMLENBQVdDLFFBQVgsQ0FBb0JTLE1BQXJCLElBQStCLENBQUMsS0FBS1YsS0FBTCxDQUFXRSxRQUFYLENBQW9CUSxNQUF4RCxFQUFnRTtBQUM5RCxhQUFLRCxRQUFMLENBQWM7QUFDWk4sb0JBQVU7QUFERSxTQUFkO0FBR0QsT0FKRCxN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LEtBQVAsR0FBZUEsS0FBZiIsImZpbGUiOiJMb2dJbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIExvZ0luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgZXJyb3JNc2c6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICBjb25zdCB0YXIgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdMb2dJbk5hbWUnKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwYXNzd29yZDogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTG9nSW4oKSB7XHJcbiAgICBpZiAoIXRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoICYmICF0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ2xvZ2luIGlzIGVtcHR5J1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgdXNlcm5hbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSBwYXNzd29yZCdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdXNlck9iaiA9IHtcclxuICAgICAgICBuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkXHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgJC5wb3N0KFVybCArICcvbG9naW4nLCB1c2VyT2JqKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdID09PSAnaXQgd29ya2VkJykge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hpJyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBlcnJvck1zZzogJydcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ0hvbWUnKTtcclxuICAgICAgICAgIHRoaXMucHJvcHMuc2V0Q3VycmVudFVzZXIocmVzcG9uc2VbMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMuc3RhdGUudmlldyBhZnRlciBzdGF0ZSBpcyBzZXQgYWdhaW4nLHRoaXMuc3RhdGUudmlldyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnI9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAnaW52YWxpZCBsb2dpbiBpbmZvcm1hdGlvbidcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbGFuZGluZyByb3cnPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpY29uLWJsb2NrIGNvbCBzNyc+XHJcbiAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiaGVhZGVyIGxvZ29cIj5XZWxjb21lIHRvIFJlZWxQYWxzPC9oMj5cclxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgY29sIHMxMiBsaWdodCBkZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgICBMZXQncyBmaW5kIHlvdXIgbmV4dCBidWRkeSBieSB5b3VyIG1vdmllIHRhc3RlIVxyXG4gICAgICAgICAgPC9oNT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5jaGFuZ2VWaWV3cygnU2lnblVwJyl9PkdvIHRvIFNpZ24gVXA8L2E+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yXCI+T1I8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbkZvcm0nPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VyX25hbWVcIiBuYW1lPSdMb2dJbk5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwidXNlcl9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+VXNlcm5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgbmFtZT0nTG9nSW5QYXNzd29yZCcgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ0luLmJpbmQodGhpcyl9PmxvZyBpbjwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj4pXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTG9nSW4gPSBMb2dJbjtcclxuIl19