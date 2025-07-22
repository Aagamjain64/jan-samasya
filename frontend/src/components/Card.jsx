// ✅ Card.jsx
import React from 'react';
import SingleCard from './SingleCard';

const Card = ({ problems, user, refreshProblems, onDelete}) => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row">
          {problems.length === 0 ? (
            <div className="col-12 text-center text-muted">
              <p>No cards to display.</p>
            </div>
          ) : (
            problems.map((problem, index) => {
              const postedBy = problem.PostedBy?._id || problem.PostedBy;
              return (
                <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={problem._id || index}>
                  <SingleCard
                    image={problem.Image || 'https://via.placeholder.com/300x200'}
                    CardTitle={problem.ProblemTitle}
                    CardDescription={problem.ProblemDescription || 'No description available.'}
                    Cardcity={problem.City || 'No city'}
                    CardState={problem.State || 'No state'}
                    problemId={problem._id}
                    problemPostedBy={postedBy}
                    isVotingEnabled={problem.isVotingEnabled}
                    user={user}
                    refreshProblems={refreshProblems}
                    onDelete={onDelete}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Card;
