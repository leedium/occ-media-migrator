#!/usr/bin/env node

/*
 * Copyright (c) 2019 LEEDIUM.
 * This file is subject to the terms and conditions
 * defined in file 'LICENSE.txt', which is part of this
 * source code package.
 */

/**
 * @project occ-media-uploader
 * @file index.js
 * @company LEEDIUM
 * @createdBy leedium
 * @contact support@leedium.com
 * @dateCreated 2019-03-06
 * @description  Tool to optimize, package, and deploy media to environments
 */

//  Return the invoked function
return require('./app/app').main(process.argv);