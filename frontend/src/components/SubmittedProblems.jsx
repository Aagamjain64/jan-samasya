import React from "react";

const Card = ({ problems }) => {
  return (
    <section className="bg-gray-2 pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {problems.length === 0 ? (
            <p className="text-center col-span-full text-lg text-gray-500">
              No cards to display.
            </p>
          ) : (
            problems.map((problem, index) => (
              <SingleCard
                key={problem._id || index}
                image={problem.Image || "https://i.gadgets360cdn.com/large/jpg_to_pdf_1591980583835.jpg"}
                CardTitle={problem.ProblemTitle}
                CardDescription={problem.ProblemDescription || "No description available."}
                Button="Vote"
                btnHref={`/problems/${problem._id || index}`}
                titleHref={`/problems/${problem._id || index}`}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Card;

const SingleCard = ({
  image,
  Button,
  CardDescription,
  CardTitle,
  titleHref,
  btnHref,
}) => {
  return (
    <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3">
      <img src={image} alt="Problem" className="w-full" />
      <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
        <h3>
          <a
            href={titleHref || "#"}
            className="mb-4 block text-xl font-semibold text-dark hover:text-primary dark:text-white sm:text-[22px]"
          >
            {CardTitle}
          </a>
        </h3>
        <p className="mb-7 text-base leading-relaxed text-body-color dark:text-dark-6">
          {CardDescription}
        </p>

        {Button && (
          <a
            href={btnHref || "#"}
            className="inline-block rounded-full border border-gray-3 px-7 py-2 text-base font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6"
          >
            {Button}
          </a>
        )}
      </div>
    </div>
  );
};
