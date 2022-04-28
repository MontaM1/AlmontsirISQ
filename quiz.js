//var json = require('./questions.json')
// Array of all the questions and choices to populate the questions. This might be saved in some JSON file or a database and we would have to read the data in.
//const json = require('questions.json');
//var all_questions = new Array(JSON.parse(json));
//document.getElementById("quiz-results-message").innerHTML = all_questions


var all_questions = [{
  question_string: "What actions do you take when you visit a site that the browser marks as insecure (URL denotes HTTP:// instead of HTTPS://)?",
  choices: {correct: "avoid saving personal information on the site", wrong: ["Ignore it altogether", "Refuse to allow the site to save cookies", "Inspect the site "]}
}, 
{
  question_string: "Which is the best way to manage passwords online?", 
  choices: {correct: "Use reliable third party encrypted cloud storage", wrong: ["Use short passwords to remember", "Use a common password for most online accounts", "Write down passwords"]}
}, 
{
question_string: "What actions do you take when you receive an unsolicited email from an unknown address?", 
choices: {correct: "Delete it immediately", wrong: ["Browse through links and media to identify potential malware", "Reply to the sender asking for their identity", "Ignore the message"]}
}, 
{
  question_string: "What actions are you supposed to take when you are a victim of a ransomware attack (Ransomware: solicitation for money or specific actions in return for access to systems or data)?",
  choices: {correct: "Shut down the computer, seek the assistance of a technician.", wrong: ["Pay out the ransom or perform the solicited actions.", "Negotiate with the attackers", "Ignore the attack"]}
},
{
  question_string: "What is the effect of private (incognito) browsing?",
  choices: {correct: "The feature does not make me invisible to either my ISP or authorities but only stops my browser from saving browsing information", wrong: ["The feature makes me invisible to anybody including my internet service provider", "The feature makes me only invisible to my internet service provider but not authorities", "It does not make browsin private in any way"]}
}];


var Quiz = function(quiz_name) {
  this.quiz_name = quiz_name;
  
  this.questions = [];
}

Quiz.prototype.add_question = function(question) {
  var index_to_add_question = Math.floor(Math.random() * this.questions.length);
  this.questions.splice(index_to_add_question, 0, question);
}

Quiz.prototype.render = function(container) {
  var self = this;
  
  $('#quiz-results').hide();
  
  $('#quiz-name').text(this.quiz_name);
  
  var question_container = $('<div>').attr('id', 'question').insertAfter('#quiz-name');
  
  function change_question() {
    self.questions[current_question_index].render(question_container);
    $('#prev-question-button').prop('disabled', current_question_index === 0);
    $('#next-question-button').prop('disabled', current_question_index === self.questions.length - 1);
   
    
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  }
  
  var current_question_index = 0;
  change_question();
  
  $('#prev-question-button').click(function() {
    if (current_question_index > 0) {
      current_question_index--;
      change_question();
    }
  });
  
  $('#next-question-button').click(function() {
    if (current_question_index < self.questions.length - 1) {
      current_question_index++;
      change_question();
    }
  });
 
  $('#submit-button').click(function() 
    {
    var score = 0;
    for (var i = 0; i < self.questions.length; i++) 
      {
        if (self.questions[i].user_choice_index === self.questions[i].correct_choice_index) 
          {
            score++;
          }
      

        //$('#quiz-retry-button').click(function(reset) {quiz.render(quiz_container);});
        $('#quiz-retry-button').click(function(reset) {$("#main_section").replaceWith(originalState);});
        
    
      }
    
   
    var percentage = score / self.questions.length;
    console.log(percentage);
    var message;
    if (percentage === 1) {
      message = 'Great job!'
    } else if (percentage >= .75) {
      message = 'You did alright.'
    } else if (percentage >= .5) {
      message = 'Better luck next time.'
    } else {
      message = 'Kindly work on your information security knowledge.'
    }
    $('#quiz-results-message').text(message);
    $('#quiz-results-score').html('You got <b>' + score + '/' + self.questions.length + '</b> questions correct.');
    $('#quiz-results').slideDown();
    $('#submit-button').slideUp();
    $('#next-question-button').slideUp();
    $('#prev-question-button').slideUp();
    $('#quiz-retry-button').sideDown();
    
  });
  
  question_container.bind('user-select-change', function() {
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  });
}

var Question = function(question_string, correct_choice, wrong_choices) {
  this.question_string = question_string;
  this.choices = [];
  this.user_choice_index = null; 
  
  this.correct_choice_index = Math.floor(Math.random(0, wrong_choices.length + 1));
  
  var number_of_choices = wrong_choices.length + 1;
  for (var i = 0; i < number_of_choices; i++) {
    if (i === this.correct_choice_index) {
      this.choices[i] = correct_choice;
    } else {
      var wrong_choice_index = Math.floor(Math.random(0, wrong_choices.length));
      this.choices[i] = wrong_choices[wrong_choice_index];
      
      wrong_choices.splice(wrong_choice_index, 1);
    }
  }
}

Question.prototype.render = function(container) {
  var self = this;
  
  var question_string_h2;
  if (container.children('h2').length === 0) {
    question_string_h2 = $('<h2>').appendTo(container);
  } else {
    question_string_h2 = container.children('h2').first();
  }
  question_string_h2.text(this.question_string);
  
  if (container.children('input[type=radio]').length > 0) {
    container.children('input[type=radio]').each(function() {
      var radio_button_id = $(this).attr('id');
      $(this).remove();
      container.children('label[for=' + radio_button_id + ']').remove();
    });
  }
  for (var i = 0; i < this.choices.length; i++) {
    var choice_radio_button = $('<input>')
      .attr('id', 'choices-' + i)
      .attr('type', 'radio')
      .attr('name', 'choices')
      .attr('value', 'choices-' + i)
      .attr('checked', i === this.user_choice_index)
      .appendTo(container);
    
    var choice_label = $('<label>')
      .text(this.choices[i])
      .attr('for', 'choices-' + i)
      .appendTo(container);
  }
  
  $('input[name=choices]').change(function(index) {
    var selected_radio_button_value = $('input[name=choices]:checked').val();
    
    self.user_choice_index = parseInt(selected_radio_button_value.substr(selected_radio_button_value.length - 1, 1));
    
    container.trigger('user-select-change');
  });
}

$(document).ready(function() {
  var quiz = new Quiz('Test your InfoSec Awareness');
  
  for (var i = 0; i < all_questions.length; i++) {
    var question = new Question(all_questions[i].question_string, all_questions[i].choices.correct, all_questions[i].choices.wrong);
    
    quiz.add_question(question);
  }
  
  var quiz_container = $('#main_section');
  quiz.render(quiz_container);
  var originalState = $('#main_section').clone;

});

