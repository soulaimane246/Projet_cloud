// Contrôleur pour la gestion des projets
const Project = require('../models/Project');

// Créer un nouveau projet
const createProject = async (req, res) => {
  try {
    const { name, description, deadline, members } = req.body;

    const project = new Project({
      name,
      description,
      deadline,
      createdBy: req.user.id,
      members: members || [],
    });

    await project.save();

    res.status(201).json({
      message: 'Projet créé avec succès',
      project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les projets
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({
      projects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un projet par ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un projet
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, deadline, members } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, deadline, members },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.status(200).json({
      message: 'Projet mis à jour avec succès',
      project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un projet
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.status(200).json({
      message: 'Projet supprimé avec succès',
      project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
