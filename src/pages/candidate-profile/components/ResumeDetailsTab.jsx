import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResumeDetailsTab = ({ 
  resumeData = {},
  onDownloadResume = () => {},
  className = ''
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const mockResumeData = {
    personalInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://sarahjohnson.dev',
      linkedin: 'https://linkedin.com/in/sarah-johnson',
      github: 'https://github.com/sarah-johnson'
    },
    summary: `Experienced Senior Frontend Developer with 5+ years of expertise in building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of leading development teams, implementing best practices, and delivering high-quality user experiences. Passionate about clean code, performance optimization, and mentoring junior developers.`,
    experience: [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        duration: 'Jan 2022 - Present',
        description: `Led development of customer-facing web applications serving 100K+ users\nImplemented React-based component library reducing development time by 40%\nMentored 3 junior developers and established code review processes\nOptimized application performance resulting in 25% faster load times`,
        technologies: ['React', 'TypeScript', 'GraphQL', 'AWS', 'Docker']
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        duration: 'Mar 2020 - Dec 2021',
        description: `Built responsive web applications using React and Redux\nCollaborated with design team to implement pixel-perfect UI components\nIntegrated RESTful APIs and implemented real-time features using WebSockets\nParticipated in agile development process and sprint planning`,
        technologies: ['React', 'Redux', 'JavaScript', 'SASS', 'Node.js']
      },
      {
        id: 3,
        title: 'Junior Frontend Developer',
        company: 'WebSolutions LLC',
        location: 'San Jose, CA',
        duration: 'Jun 2019 - Feb 2020',
        description: `Developed and maintained client websites using HTML, CSS, and JavaScript\nWorked closely with senior developers to learn best practices\nImplemented responsive designs and cross-browser compatibility\nAssisted in migrating legacy applications to modern frameworks`,
        technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap']
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        duration: '2015 - 2019',
        gpa: '3.8/4.0',
        relevant: ['Data Structures', 'Algorithms', 'Web Development', 'Database Systems']
      }
    ],
    skills: {
      technical: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'Git'],
      frameworks: ['Next.js', 'Express.js', 'Redux', 'Tailwind CSS', 'Material-UI'],
      tools: ['VS Code', 'Figma', 'Jira', 'Slack', 'Postman', 'Chrome DevTools'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis']
    },
    certifications: [
      {
        id: 1,
        name: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        date: 'March 2023',
        credentialId: 'AWS-DEV-2023-001'
      },
      {
        id: 2,
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: 'January 2022',
        credentialId: 'META-REACT-2022-456'
      }
    ],
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce application with React frontend and Node.js backend',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
        url: 'https://github.com/sarah-johnson/ecommerce-platform'
      },
      {
        id: 2,
        name: 'Task Management App',
        description: 'Real-time collaborative task management application with drag-and-drop functionality',
        technologies: ['React', 'TypeScript', 'Socket.io', 'MongoDB'],
        url: 'https://github.com/sarah-johnson/task-manager'
      }
    ]
  };

  const displayData = Object.keys(resumeData)?.length > 0 ? resumeData : mockResumeData;

  const formatDescription = (description) => {
    return description?.split('\n')?.map((line, index) => (
      <li key={index} className="text-sm text-muted-foreground mb-1">
        {line}
      </li>
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resume Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Resume Details</h2>
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          iconSize={16}
          onClick={onDownloadResume}
        >
          Download Resume
        </Button>
      </div>
      {/* Personal Information */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="User" size={20} className="mr-2 text-primary" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-foreground">{displayData?.personalInfo?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground">{displayData?.personalInfo?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Phone</label>
            <p className="text-foreground">{displayData?.personalInfo?.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <p className="text-foreground">{displayData?.personalInfo?.location}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Website</label>
            <a 
              href={displayData?.personalInfo?.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {displayData?.personalInfo?.website}
            </a>
          </div>
        </div>
      </div>
      {/* Professional Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="FileText" size={20} className="mr-2 text-primary" />
          Professional Summary
        </h3>
        <div className="relative">
          <p className={`text-muted-foreground leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
            {displayData?.summary}
          </p>
          {displayData?.summary?.length > 200 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-primary hover:text-primary/80"
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      </div>
      {/* Work Experience */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-6 flex items-center">
          <Icon name="Briefcase" size={20} className="mr-2 text-primary" />
          Work Experience
        </h3>
        <div className="space-y-6">
          {displayData?.experience?.map((job, index) => (
            <div key={job?.id} className="relative">
              {index !== displayData?.experience?.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />
              )}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Building" size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-medium text-foreground">{job?.title}</h4>
                    <span className="text-sm text-muted-foreground">{job?.duration}</span>
                  </div>
                  <p className="text-primary font-medium mb-1">{job?.company}</p>
                  <p className="text-sm text-muted-foreground mb-3">{job?.location}</p>
                  <ul className="space-y-1 mb-4">
                    {formatDescription(job?.description)}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {job?.technologies?.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Education */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-6 flex items-center">
          <Icon name="GraduationCap" size={20} className="mr-2 text-primary" />
          Education
        </h3>
        <div className="space-y-4">
          {displayData?.education?.map((edu) => (
            <div key={edu?.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="School" size={20} className="text-success" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-foreground">{edu?.degree}</h4>
                <p className="text-primary font-medium">{edu?.school}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <span>{edu?.location}</span>
                  <span>{edu?.duration}</span>
                  <span>GPA: {edu?.gpa}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {edu?.relevant?.map((course, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Skills */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-6 flex items-center">
          <Icon name="Code" size={20} className="mr-2 text-primary" />
          Technical Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Programming Languages & Frameworks</h4>
            <div className="flex flex-wrap gap-2">
              {displayData?.skills?.technical?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Frameworks & Libraries</h4>
            <div className="flex flex-wrap gap-2">
              {displayData?.skills?.frameworks?.map((framework, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full"
                >
                  {framework}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Tools & Platforms</h4>
            <div className="flex flex-wrap gap-2">
              {displayData?.skills?.tools?.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-warning/10 text-warning text-sm font-medium rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Databases</h4>
            <div className="flex flex-wrap gap-2">
              {displayData?.skills?.databases?.map((db, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full"
                >
                  {db}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Certifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-6 flex items-center">
          <Icon name="Award" size={20} className="mr-2 text-primary" />
          Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayData?.certifications?.map((cert) => (
            <div key={cert?.id} className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-1">{cert?.name}</h4>
              <p className="text-primary text-sm font-medium mb-1">{cert?.issuer}</p>
              <p className="text-muted-foreground text-sm mb-2">{cert?.date}</p>
              <p className="text-xs text-muted-foreground font-mono">
                ID: {cert?.credentialId}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Projects */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-6 flex items-center">
          <Icon name="Folder" size={20} className="mr-2 text-primary" />
          Notable Projects
        </h3>
        <div className="space-y-4">
          {displayData?.projects?.map((project) => (
            <div key={project?.id} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{project?.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  iconSize={14}
                  onClick={() => window.open(project?.url, '_blank')}
                  className="text-muted-foreground hover:text-primary"
                />
              </div>
              <p className="text-muted-foreground text-sm mb-3">{project?.description}</p>
              <div className="flex flex-wrap gap-2">
                {project?.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailsTab;