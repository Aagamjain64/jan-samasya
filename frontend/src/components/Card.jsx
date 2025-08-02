// ✅ Card.jsx
import React ,{useEffect}from 'react';
import SingleCard from './SingleCard';
import '../assets/styls/Card.css'

const Card = ({ problems, user, refreshProblems, onDelete}) => {
 useEffect(() => {
  console.log("🧑‍💻 Card.jsx received user:", user);
  
}, [user]);

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
               { console.log("PostedBy check:", problem.PostedBy)}

                  <SingleCard
                    image={problem.Image || ''}
                    CardTitle={problem.ProblemTitle}
                    CardDescription={problem.ProblemDescription || 'No description available.'}
                    Cardcity={problem.City || 'No city'}
                    CardState={problem.State || 'No state'}
                    problemId={problem._id}
                    problemPostedBy={postedBy}
                      postedByUsername={problem.PostedBy?.username}  
                    postedByisAnonymous={problem.PostedBy?.isAnonymous}

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
