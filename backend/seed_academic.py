import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.academic import Subject, Topic, Assessment, Question


def seed_academic_curriculum():
    """
    Seeds initial subjects, topic hierarchy, and diagnostic assessments with MCQs.
    Fulfills FRD §4 (Student Requirements) and FRD §6 (Academic Intelligence).
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if subjects already exist
    if db.query(Subject).first():
        print("[NEXOURA SEED] Academic curriculum already initialized.")
        seed_sandbox_users(db)
        db.close()
        return

    print("[NEXOURA SEED] Bootstrapping Academic Curriculum & Assessments...")

    # 1. Subjects
    dsa = Subject(
        code="CS301",
        name="Data Structures & Algorithms",
        department="Computer Science",
        semester=4,
        description="Comprehensive study of algorithmic problem solving, linear and non-linear data structures, and asymptotic complexity analysis."
    )
    dbms = Subject(
        code="CS302",
        name="Database Management Systems",
        department="Computer Science",
        semester=4,
        description="Relational database architecture, SQL optimization, transactional ACID properties, normalization, and relational algebra."
    )
    os_subj = Subject(
        code="CS303",
        name="Operating Systems",
        department="Computer Science",
        semester=4,
        description="Process scheduling, inter-process communication, memory paging, deadlocks, and virtual file systems."
    )
    db.add_all([dsa, dbms, os_subj])
    db.flush()

    # 2. Topics for DSA
    t_graph = Topic(
        subject_id=dsa.id,
        code="DSA-GRAPH",
        name="Graph Traversal & Pathfinding",
        description="Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra algorithm, and topological sorting."
    )
    t_tree = Topic(
        subject_id=dsa.id,
        code="DSA-TREE",
        name="Binary Search Trees & Heaps",
        description="BST insertion, deletion, AVL self-balancing rotations, and min/max heap priority queues."
    )
    t_sort = Topic(
        subject_id=dsa.id,
        code="DSA-SORT",
        name="Sorting & Divide-and-Conquer",
        description="Quicksort partition schemes, Mergesort recurrence relations, and binary search limits."
    )
    t_dp = Topic(
        subject_id=dsa.id,
        code="DSA-DP",
        name="Dynamic Programming",
        description="Overlapping subproblems, optimal substructure, and memoized tabular solutions."
    )

    # Topics for DBMS
    t_sql = Topic(
        subject_id=dbms.id,
        code="DBMS-SQL",
        name="SQL Queries & Complex Joins",
        description="Subqueries, correlated queries, aggregate grouping, and INNER/LEFT/FULL outer joins."
    )
    t_norm = Topic(
        subject_id=dbms.id,
        code="DBMS-NORM",
        name="Normalization & Functional Dependencies",
        description="1NF, 2NF, 3NF, BCNF anomalies, and dependency preservation decomposition."
    )
    t_txn = Topic(
        subject_id=dbms.id,
        code="DBMS-TXN",
        name="Transactions & Concurrency Control",
        description="ACID properties, two-phase locking (2PL), serializability, and deadlock detection."
    )

    # Topics for OS
    t_sched = Topic(
        subject_id=os_subj.id,
        code="OS-SCHED",
        name="CPU Scheduling & Process Threads",
        description="Round-Robin, SJF, Multilevel Feedback Queues, and context switching overhead."
    )
    t_mem = Topic(
        subject_id=os_subj.id,
        code="OS-MEM",
        name="Virtual Memory & Paging",
        description="Demand paging, page replacement algorithms (LRU, FIFO), and thrashing mitigation."
    )

    db.add_all([t_graph, t_tree, t_sort, t_dp, t_sql, t_norm, t_txn, t_sched, t_mem])
    db.flush()

    # 3. Assessment 1: DSA Benchmark
    a_dsa = Assessment(
        subject_id=dsa.id,
        title="DSA Benchmark: Graphs & Tree Structures",
        description="Evaluate your core proficiency in graph traversals, adjacency representations, and binary tree properties.",
        time_limit_minutes=15,
        passing_percentage=60.0
    )
    db.add(a_dsa)
    db.flush()

    # Questions for DSA Benchmark
    q1 = Question(
        assessment_id=a_dsa.id,
        topic_id=t_graph.id,
        question_text="What is the worst-case time complexity of Breadth-First Search (BFS) using an adjacency list representation with V vertices and E edges?",
        options=["O(V + E)", "O(V * E)", "O(V^2)", "O(E log V)"],
        correct_answer="O(V + E)",
        explanation="In an adjacency list representation, BFS inspects each vertex once and traverses each edge at most twice (or once for directed graphs), giving O(V + E) time complexity.",
        points=1
    )
    q2 = Question(
        assessment_id=a_dsa.id,
        topic_id=t_graph.id,
        question_text="Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue data structure for its frontier exploration?",
        options=["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
        correct_answer="Breadth-First Search (BFS)",
        explanation="BFS systematically explores nodes level by level using a FIFO queue, ensuring the shortest path in unweighted graphs.",
        points=1
    )
    q3 = Question(
        assessment_id=a_dsa.id,
        topic_id=t_tree.id,
        question_text="In a valid Binary Search Tree (BST), what traversal sequence produces the keys in strictly non-decreasing sorted order?",
        options=["In-order Traversal (Left, Root, Right)", "Pre-order Traversal (Root, Left, Right)", "Post-order Traversal (Left, Right, Root)", "Level-order Traversal"],
        correct_answer="In-order Traversal (Left, Root, Right)",
        explanation="In-order traversal visits all left subtree keys first (which are strictly smaller), then the root, then the right subtree keys (which are strictly larger).",
        points=1
    )
    q4 = Question(
        assessment_id=a_dsa.id,
        topic_id=t_tree.id,
        question_text="What is the maximum number of nodes at level 'L' of a binary tree (where the root is at level 0)?",
        options=["2^L", "2^(L+1) - 1", "2L", "L^2"],
        correct_answer="2^L",
        explanation="At level 0 there is 2^0 = 1 node; at level 1 there are 2^1 = 2 nodes; at level L there are at most 2^L nodes.",
        points=1
    )
    q5 = Question(
        assessment_id=a_dsa.id,
        topic_id=t_graph.id,
        question_text="Which of the following cycle detection techniques is applicable to directed graphs using Depth-First Search?",
        options=["Detecting a Back Edge during traversal", "Detecting a Cross Edge", "Counting leaf nodes", "Comparing in-degree of start node"],
        correct_answer="Detecting a Back Edge during traversal",
        explanation="A back edge connects a vertex to an ancestor in the DFS tree/recursion stack, indicating a directed cycle.",
        points=1
    )
    db.add_all([q1, q2, q3, q4, q5])

    # 4. Assessment 2: DBMS Benchmark
    a_dbms = Assessment(
        subject_id=dbms.id,
        title="DBMS Diagnostic: SQL Mastery & Normalization",
        description="Assess practical query formulation, relational joins, Boyce-Codd Normal Form, and functional dependencies.",
        time_limit_minutes=15,
        passing_percentage=60.0
    )
    db.add(a_dbms)
    db.flush()

    # Questions for DBMS
    q6 = Question(
        assessment_id=a_dbms.id,
        topic_id=t_sql.id,
        question_text="Which SQL join returns all records from the left table, and the matched records from the right table, filling with NULL when no match exists?",
        options=["LEFT OUTER JOIN", "INNER JOIN", "RIGHT OUTER JOIN", "CROSS JOIN"],
        correct_answer="LEFT OUTER JOIN",
        explanation="A LEFT OUTER JOIN preserves all rows from the left table regardless of whether matching rows exist in the right table.",
        points=1
    )
    q7 = Question(
        assessment_id=a_dbms.id,
        topic_id=t_norm.id,
        question_text="A relational schema is in Third Normal Form (3NF) if it is in 2NF and has NO:",
        options=["Transitive functional dependencies on any candidate key", "Partial dependencies on composite keys", "Repeating groups or multi-valued attributes", "Foreign key constraints"],
        correct_answer="Transitive functional dependencies on any candidate key",
        explanation="3NF eliminates transitive dependencies (where a non-prime attribute determines another non-prime attribute).",
        points=1
    )
    q8 = Question(
        assessment_id=a_dbms.id,
        topic_id=t_sql.id,
        question_text="In SQL, which clause is specifically used to filter aggregated groups created by a GROUP BY clause?",
        options=["HAVING", "WHERE", "ORDER BY", "DISTINCT"],
        correct_answer="HAVING",
        explanation="WHERE filters rows before aggregation, whereas HAVING filters groups after aggregation.",
        points=1
    )
    q9 = Question(
        assessment_id=a_dbms.id,
        topic_id=t_norm.id,
        question_text="Which normal form strictly requires that for every non-trivial functional dependency X -> Y, X must be a Superkey?",
        options=["Boyce-Codd Normal Form (BCNF)", "First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)"],
        correct_answer="Boyce-Codd Normal Form (BCNF)",
        explanation="BCNF is a stricter version of 3NF where every determinant in a non-trivial functional dependency must be a superkey.",
        points=1
    )
    q10 = Question(
        assessment_id=a_dbms.id,
        topic_id=t_sql.id,
        question_text="What will be the result of comparing a value to NULL using the equality operator (e.g., 'val = NULL') in SQL?",
        options=["UNKNOWN (evaluates to falsy in WHERE)", "TRUE", "FALSE", "SYNTAX ERROR"],
        correct_answer="UNKNOWN (evaluates to falsy in WHERE)",
        explanation="SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). Comparisons with NULL evaluate to UNKNOWN, requiring the 'IS NULL' operator.",
        points=1
    )
    db.add_all([q6, q7, q8, q9, q10])

    db.commit()
    print("[NEXOURA SEED] Academic curriculum successfully seeded (3 Subjects, 9 Topics, 2 Assessments, 10 Questions).")

    # Seed demo sandbox student and teacher
    seed_sandbox_users(db)
    db.close()


def seed_sandbox_users(db):
    from app.models.user import User, UserRole, StudentProfile, TeacherProfile
    from app.core.security import hash_password

    # 1. Demo Student
    stu_email = "student@nexoura.edu"
    if not db.query(User).filter(User.email == stu_email).first():
        stu_user = User(
            name="Alex Student",
            email=stu_email,
            password_hash=hash_password("Password123!"),
            role=UserRole.STUDENT,
            is_active=True
        )
        db.add(stu_user)
        db.flush()
        stu_profile = StudentProfile(
            user_id=stu_user.id,
            student_id="STU-DEMO-001",
            department="Computer Science",
            course="B.Tech Computer Science",
            semester=4
        )
        db.add(stu_profile)
        print(f"[NEXOURA SEED] Demo student created: {stu_email}")

    # 2. Demo Teacher
    tea_email = "teacher@nexoura.edu"
    if not db.query(User).filter(User.email == tea_email).first():
        tea_user = User(
            name="Prof. Sarah Jenkins",
            email=tea_email,
            password_hash=hash_password("Password123!"),
            role=UserRole.TEACHER,
            is_active=True
        )
        db.add(tea_user)
        db.flush()
        tea_profile = TeacherProfile(
            user_id=tea_user.id,
            employee_id="EMP-8801",
            college="NEXOURA Institute of Technology",
            department="Computer Science",
            designation="Associate Professor"
        )
        db.add(tea_profile)
        print(f"[NEXOURA SEED] Demo teacher created: {tea_email}")

    # 3. Demo Parent (Linked to Alex Student)
    par_email = "parent@nexoura.edu"
    if not db.query(User).filter(User.email == par_email).first():
        from datetime import datetime, timezone
        from app.models.user import ParentProfile, ParentStudentLink, LinkStatus

        par_user = User(
            name="Eleanor Jenkins (Parent)",
            email=par_email,
            password_hash=hash_password("Password123!"),
            role=UserRole.PARENT,
            is_active=True
        )
        db.add(par_user)
        db.flush()

        par_profile = ParentProfile(
            user_id=par_user.id,
            parent_id="PRT-9001",
            college="NEXOURA Institute of Technology",
            contact_number="+91 98765 43210"
        )
        db.add(par_profile)
        db.flush()

        alex_student = db.query(StudentProfile).filter(StudentProfile.student_id == "STU-DEMO-001").first()
        if alex_student:
            link = ParentStudentLink(
                parent_id=par_profile.id,
                student_id=alex_student.id,
                status=LinkStatus.VERIFIED,
                verified_at=datetime.now(timezone.utc)
            )
            db.add(link)
            print(f"[NEXOURA SEED] Demo parent created: {par_email} verified & linked to Alex Student ({alex_student.student_id})")

    db.commit()

if __name__ == "__main__":
    seed_academic_curriculum()
