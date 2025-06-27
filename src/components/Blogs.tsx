
import '../styles/Blog.css';

export default function Blog() {
  return (
    <div className="blog-section">
      <h2>Latest Blogs</h2>
      <div className="blog-cards">
        <div className="blog-card">
          <h3>Why Employee Engagement Matters</h3>
          <p>
            Discover how employee engagement impacts productivity and retention — and how to improve it.
          </p>
          <a href="#">Read More →</a>
        </div>

        <div className="blog-card">
          <h3>Top 5 HR Challenges in 2025</h3>
          <p>
            A breakdown of the most pressing challenges HR teams face this year — and how to tackle them.
          </p>
          <a href="#">Read More →</a>
        </div>

        <div className="blog-card">
          <h3>Building a Great Remote Culture</h3>
          <p>
            Tips and strategies to create a connected and motivated remote workforce.
          </p>
          <a href="#">Read More →</a>
        </div>
      </div>
    </div>
  );
}
