const { Op } = require('sequelize');
const _ = require('lodash');

const {
  Cinema, Room
} = require('../../models');

const controller = 'cinemas';
const VIEW_SHOW_PATH = 'admin/cinemas/view';
const VIEW_EDIT_PATH = 'admin/cinemas/edit';
const VIEW_ADD_PATH = 'admin/cinemas/add';

const CinemaController = module.exports;

CinemaController.get = async(req, res) => {
  const cinemaQueryName = req.query.name;

  const cinemas = await Cinema.findAll({
    where: {
      name: {
        [Op.like]: `%${cinemaQueryName}%`
      }
    },
    attributes: ['id', 'name'],
    include: {
      model: Room,
      attributes: ['id'],
      seperate: true
    }
  });

  res.status(200).json(_.map(cinemas, (cinema) => ({
    id: cinema.id,
    name: cinema.name,
    suggestedRoomName: `RAP${cinema.Rooms.length + 1}`
  })));
};

CinemaController.list = async(req, res) => {
  const loginUser = req.currentUser;
  const cinemas = await Cinema.findAll({
    raw: true
  });

  const action = 'list';
  const data = cinemas;
  const errorData = {};

  res.render('admin/cinemas/list', {
    page_title: 'Admin - Dashboard',
    data,
    loginUser,
    controller,
    action,
    errorData,
  });
};

CinemaController.getById = async(req, res) => {
  try {
    const cinemaId = req.params.id;
    const loginUser = req.currentUser;
    const { originalUrl } = req;

    let viewPath = '';
    let data = {};
    const errorData = {};
    let action;

    if (originalUrl.indexOf('edit') !== -1) {
      viewPath = VIEW_EDIT_PATH;
      action = 'edit';
    } else if (originalUrl.indexOf('add') !== -1) {
      viewPath = VIEW_ADD_PATH;
      action = 'add';
    } else {
      viewPath = VIEW_SHOW_PATH;
      action = 'show';
    }

    if (viewPath !== VIEW_ADD_PATH) {
      const cinema = await Cinema.findByPk(cinemaId);

      data = cinema;
    }

    res.render(viewPath, {
      page_title: 'Admin - Dashboard',
      controller,
      loginUser,
      data,
      action,
      errorData
    });
  } catch (e) {
    console.error(e);
  }
};

CinemaController.updateById = async(req, res) => {
  try {
    const cinemaId = req.params.id;
    const {
      name, address
    } = req.body;

    await Cinema.update(
      {
        name, address
      },
      {
        where: { id: cinemaId },
      }
    );

    req.flash('success', 'R???p chi???u ???????c c???p nh???t th??nh c??ng');
    res.redirect(`/admin/${controller}/list`);
  } catch (e) {
    console.error(e);
    req.flash('error', 'C?? l???i x???y ra trong qu?? tr??nh c???p nh???t R???p chi???u');
    res.redirect(`/admin/${controller}/list`);
  }
};

CinemaController.deleteById = async(req, res) => {
  try {
    const cinemaId = req.params.id;

    await Cinema.destroy({
      where: { id: cinemaId }
    });

    req.flash('success', 'R???p chi???u ???????c x??a th??nh c??ng');
    res.redirect(`/admin/${controller}/list`);
  } catch (e) {
    console.error(e);
    req.flash('error', 'C?? l???i x???y ra trong qu?? tr??nh x??a R???p chi???u');
    res.redirect(`/admin/${controller}/list`);
  }
};

CinemaController.createNew = async(req, res) => {
  try {
    const {
      name, address
    } = req.body;

    await Cinema.create(
      {
        name, address
      }
    );

    req.flash('success', 'R???p chi???u ???????c th??m th??nh c??ng');
    res.redirect(`/admin/${controller}/list`);
  } catch (e) {
    console.error(e);
    req.flash('error', 'C?? l???i x???y ra trong qu?? tr??nh th??m R???p chi???u');
    res.redirect(`/admin/${controller}/list`);
  }
};

