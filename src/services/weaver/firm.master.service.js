const httpStatus = require('http-status');

const { FirmMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

const { deleteFile } = require('../../utils/upload');

const createFirmMaster = async (firmBody, user) => {
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  // Do not trust these values from frontend
  firmBody.userId = user._id;
  firmBody.manufactureEmail = user.email;

  // Convert uploaded file arrays
  if (Array.isArray(firmBody.firmLogoLeft)) {
    firmBody.firmLogoLeft = firmBody.firmLogoLeft[0];
  }

  if (Array.isArray(firmBody.firmLogoRight)) {
    firmBody.firmLogoRight = firmBody.firmLogoRight[0];
  }

  if (Array.isArray(firmBody.invoiceSign)) {
    firmBody.invoiceSign = firmBody.invoiceSign[0];
  }

  if (Array.isArray(firmBody.challanSign)) {
    firmBody.challanSign = firmBody.challanSign[0];
  }

  if (Array.isArray(firmBody.envelopLogo)) {
    firmBody.envelopLogo = firmBody.envelopLogo[0];
  }

  // Convert bank details if required
  if (typeof firmBody.bankDetails === 'string') {
    try {
      firmBody.bankDetails = JSON.parse(firmBody.bankDetails);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid bankDetails JSON');
    }
  }

  const firm = await FirmMaster.create(firmBody);

  return firm;
};

const queryFirmMaster = async (filter, options) => {
  return FirmMaster.paginate(filter, options);
};

const searchFirmMaster = async (filter, options) => {
  const { search, ...otherFilters } = filter;

  const query = {
    ...otherFilters,
  };

  if (search) {
    const regex = {
      $regex: search,
      $options: 'i',
    };

    query.$or = [
      {
        firmName: regex,
      },
      {
        firmCode: regex,
      },
      {
        ownerName: regex,
      },
      {
        phoneNo: regex,
      },
      {
        emailId: regex,
      },
      {
        gstNo: regex,
      },
      {
        panNo: regex,
      },
      {
        stateName: regex,
      },
      {
        city: regex,
      },
      {
        manufactureEmail: regex,
      },
    ];
  }

  return FirmMaster.paginate(query, options);
};

const getFirmMasterById = async (id) => {
  const firm = await FirmMaster.findById(id);

  if (!firm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Firm Master not found');
  }

  return firm;
};

const updateFirmMasterById = async (id, updateBody) => {
  const firm = await FirmMaster.findById(id);

  if (!firm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Firm Master not found');
  }

  const fileFields = ['firmLogoLeft', 'firmLogoRight', 'invoiceSign', 'challanSign', 'envelopLogo'];

  for (const field of fileFields) {
    if (Array.isArray(updateBody[field]) && updateBody[field].length) {
      const newFile = updateBody[field][0];

      // Delete old file
      if (firm[field]) {
        try {
          await deleteFile(firm[field]);
        } catch (error) {
          console.error(`Failed to delete old ${field}:`, error.message);
        }
      }

      updateBody[field] = newFile;
    }
  }

  if (typeof updateBody.bankDetails === 'string') {
    try {
      updateBody.bankDetails = JSON.parse(updateBody.bankDetails);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid bankDetails JSON');
    }
  }
  delete updateBody.userId;

  delete updateBody.manufactureEmail;

  Object.assign(firm, updateBody);

  await firm.save();

  return firm;
};

const deleteFirmMasterById = async (id) => {
  const firm = await FirmMaster.findById(id);

  if (!firm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Firm Master not found');
  }
  const files = [firm.firmLogoLeft, firm.firmLogoRight, firm.invoiceSign, firm.challanSign, firm.envelopLogo].filter(
    Boolean
  );

  if (files.length) {
    await Promise.all(
      files.map(async (file) => {
        try {
          await deleteFile(file);
        } catch (error) {
          console.error('File deletion failed:', error.message);
        }
      })
    );
  }

  await firm.deleteOne();

  return firm;
};

const setDefaultFirm = async (id, userId) => {
  const firm = await FirmMaster.findOne({
    _id: id,
    userId,
  });

  if (!firm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Firm Master not found');
  }

  await FirmMaster.updateMany(
    {
      userId,
      _id: {
        $ne: id,
      },
    },
    {
      $set: {
        isDefault: false,
      },
    }
  );

  firm.isDefault = true;

  await firm.save();

  return firm;
};

const getDefaultFirm = async (userId) => {
  return FirmMaster.findOne({
    userId,
    isDefault: true,
    isActive: true,
  });
};

module.exports = {
  createFirmMaster,
  queryFirmMaster,
  searchFirmMaster,
  getFirmMasterById,
  updateFirmMasterById,
  deleteFirmMasterById,
  setDefaultFirm,
  getDefaultFirm,
};
