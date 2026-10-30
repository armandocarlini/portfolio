(function () {
  'use strict';
  const raiz = document.documentElement;
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- assinatura (vetorizada da foto, traço a traço) ---------- */
  const SIG = [
    [0, .079, 'M27.2 531L29 549C29 549 29.7 555.3 30 558.4C30.3 561.6 30.6 564.8 30.9 567.9C31.3 571 31.7 574.2 32.1 577.3C32.5 580.5 33 583.6 33.6 586.7C34.2 589.8 34.8 592.9 35.6 596C36.4 599.1 37.3 602.1 38.3 605.1C39.2 608.1 40.1 611.2 41.1 614.2C42 617.2 43 620.2 44 623.2C45 626.2 46 629.2 47 632.2C48 635.2 49.1 638.2 50.1 641.2C51.2 644.2 52.2 647.2 53.3 650.2C54.4 653.1 55.5 656.1 56.6 659C57.8 662 59 664.9 60.3 667.8C61.7 670.7 63.1 673.5 64.6 676.3C66.1 679.1 67.7 681.8 69.3 684.5C70.9 687.2 72.6 689.9 74.3 692.6C76 695.3 77.6 698 79.5 700.6C81.4 703.1 83.3 705.6 85.5 707.9C87.6 710.2 90 712.4 92.3 714.5C94.7 716.5 97 719.3 99.7 720.3C102.4 721.4 106 721.6 108.7 720.8C111.6 720.1 114.5 718 116.5 715.8C118.6 713.6 119.6 710.4 120.8 707.5C121.9 704.6 122.7 701.5 123.5 698.4C124.3 695.4 124.9 692.2 125.4 689.1C125.8 686 126.1 682.8 126.3 679.7C126.5 676.5 126.6 673.3 126.7 670.2C126.8 667 126.7 663.8 126.7 660.7C126.7 657.5 126.6 654.3 126.5 651.2C126.4 648 126.2 644.9 126 641.7C125.7 638.5 125.4 635.4 125.1 632.2C124.8 629.1 124.4 625.9 124.1 622.8C123.7 619.6 123.3 616.5 122.9 613.4C122.5 610.2 122.2 607.1 121.7 603.9C121.3 600.8 121.3 597.2 120.3 594.6C119.4 592.3 116.4 588.8 116.4 588.8'],
    [.125, .053, 'M133.5 530L91.5 430L63 311'],
    [.205, .029, 'M114.3 552.4C114.3 552.4 109.9 556.4 107.6 558.3C105.3 560.3 102.9 562.3 100.4 564C97.9 565.7 95 567.1 92.5 568.8C90 570.5 87.5 572.1 85.1 574.1C82.8 576 80.6 578 78.6 580.2C76.6 582.4 74.6 584.8 72.9 587.3C71.2 589.7 69.6 592.3 68.2 595C66.8 597.6 65.6 600.4 64.6 603.2C63.6 606 62.7 609 62.1 611.9C61.5 614.8 61 617.8 60.8 620.8C60.6 623.8 60.5 626.8 60.7 629.8C60.8 632.8 61.2 635.8 61.8 638.8C62.3 641.7 63.1 644.7 64 647.5C65 650.4 66.1 653.2 67.5 655.9C68.8 658.6 70.5 661.5 72 663.7C73.1 665.4 75.2 668.1 75.2 668.1'],
    [.235, .058, 'M75.2 668.1C75.2 668.1 78 662.8 79.4 660.2C80.7 657.5 82.1 654.8 83.5 652.2C84.9 649.5 86.3 646.8 87.7 644.2C89 641.5 90.4 638.9 91.8 636.2C93.2 633.5 94.6 630.9 96 628.2C97.3 625.6 98.7 622.9 100.1 620.2C101.5 617.6 102.9 614.9 104.2 612.2C105.6 609.6 107 606.9 108.4 604.3C109.8 601.6 111.2 599 112.5 596.3C113.9 593.5 115.8 590.7 116.4 587.8C116.9 584.8 116 581.7 115.8 578.7C115.7 575.6 115.6 572.6 115.4 569.6C115.3 566.6 115.1 563.5 114.9 560.5C114.7 557.5 114.5 554.5 114.2 551.4C113.9 548.4 113.5 545.4 113.1 542.5C112.6 539.5 112 536.6 111.4 533.6C110.9 530.5 110.3 527.4 109.7 524.2C109.1 521.1 108.5 518 107.9 514.9C107.3 511.8 106.7 508.7 106.1 505.6C105.5 502.5 104.9 499.4 104.2 496.3C103.6 493.2 103 490 102.4 486.9C101.8 483.8 101.2 480.7 100.6 477.6C100 474.5 99.4 471.4 98.8 468.3C98.2 465.2 97.6 462.1 97 459C96.4 455.8 95.8 452.5 95.3 449.6C94.9 447 94.1 442.2 94.1 442.2L91.5 430'],
    [.328, .025, 'M153.6 517.2C153.6 517.2 149.1 521.2 146.9 523.2C144.7 525.2 142.4 527.2 140.2 529.2C137.9 531.2 135.7 533.2 133.5 535.2C131.1 537.3 128.7 539.5 126.4 541.6C124.1 543.6 121.8 545.7 119.7 547.6C117.8 549.2 114.3 552.4 114.3 552.4'],
    [.355, .025, 'M116.4 588.8C116.4 588.8 119.2 583.4 120.6 580.8C122 578.1 123.4 575.4 124.7 572.8C126.1 570.1 127.5 567.5 128.9 564.8C130.3 562.1 131.7 559.5 133 556.8C134.4 554.2 135.8 551.5 137.2 548.8C138.6 546.2 140 543.5 141.3 540.8C142.7 538.2 144.1 535.5 145.5 532.9C146.9 530.2 148.3 527.5 149.6 524.9C151 522.2 152.4 519.5 153.8 516.9C155.2 514.2 156.6 511.6 157.9 508.9C159.3 506.1 160.7 503.3 161.9 500.5C163.1 497.6 163.5 494.3 165.2 491.9C166.9 489.5 172 486 172 486'],
    [.41, .037, 'M133.5 530L187.3 679.4'],
    [.462, .025, 'M165 542L148 528.1'],
    [.495, .055, 'M185 467C185 467 180 470.9 178 473.2C176 475.6 174.2 478.3 173 481.2C171.7 484 171.1 487.2 170.6 490.3C170 493.4 170 496.6 169.8 499.8C169.7 502.9 169.7 506.1 169.6 509.3C169.5 512.4 169.6 515.6 169.4 518.8C169.3 521.9 169.3 525.1 168.9 528.3C168.4 531.4 167.4 534.4 166.8 537.5C166.1 540.5 165.1 543.6 164.9 546.7C164.6 549.8 164.5 553.1 165.2 556.1C165.9 559 168 561.6 169.1 564.5C170.2 567.4 171.1 570.5 171.9 573.5C172.8 576.6 173.4 579.7 174.1 582.8C174.8 585.9 175.4 589 176 592.1C176.5 595.2 176.9 598.4 177.7 601.4C178.4 604.4 180.1 607.2 180.6 610.2C181.2 613.2 181 618.2 181.1 619.4C181.1 619.6 181.2 619.9 181.2 619.9L189 696'],
    [.56, .025, 'M182 608C182 608 187.4 605.2 189.5 603.2C191.8 601.1 193.3 598.1 195.2 595.5C197 592.9 198.8 590.3 200.5 587.7C202.3 585.1 204.1 582.4 205.9 579.8C207.7 577.2 209.3 574.4 211.4 572.1C213.5 569.8 216.3 567.1 218.4 566C219.7 565.3 222 565 222 565'],
    [.591, .025, 'M196 517C196 517 196.1 510.7 196 507.5C195.9 504.4 196.3 501.1 195.6 498.2C194.9 495.2 192.6 492.7 191.7 489.7C190.9 486.8 190.9 483.5 190.4 480.4C189.9 477.3 189.8 473.5 188.7 471.2C187.8 469.4 185 467 185 467'],
    [.619, .025, 'M196 496C196 496 200.1 491.9 201.3 489.3C202.5 486.6 202.5 483.1 203 480C203.6 476.9 204 473.8 204.5 470.6C205 467.5 205.5 464.4 206.1 461.3C206.7 458.2 206.8 455 208.2 452C209.6 448.6 214.9 442.1 214.9 442.1'],
    [.644, .025, 'M215 442L222 459'],
    [.679, .138, 'M230.5 398.4L236.9 365.5C236.9 365.5 237.9 359.3 238.5 356.2C239 353.1 239.6 350 240.2 346.8C240.8 343.7 241.4 340.6 242.1 337.5C242.7 334.4 243.4 331.3 244 328.2C244.7 325.1 245.3 322 246 318.9C246.7 315.9 247.4 312.8 248.1 309.7C248.8 306.6 249.6 303.5 250.3 300.4C251.1 297.4 252 294.3 252.8 291.3C253.6 288.2 254.4 285.1 255.2 282.1C256 279 256.8 275.9 257.6 272.9C258.4 269.8 259.2 266.8 260.1 263.7C260.9 260.7 261.8 257.6 262.7 254.6C263.6 251.5 264.5 248.5 265.4 245.5C266.3 242.5 267.2 239.4 268.2 236.4C269.2 233.4 270.3 230.4 271.4 227.5C272.5 224.5 273.8 221.6 275 218.7C276.2 215.7 277.4 212.8 278.6 209.9C279.9 207 281.1 204 282.5 201.2C283.9 198.4 285.2 195.5 286.9 192.8C288.6 190.2 290.4 187.5 292.7 185.3C294.9 183.2 299.3 180.2 300.3 180C300.6 180 300.8 180.2 300.8 180.2C300.8 180.2 302.8 185.9 303 188.9C303.1 191.9 302.1 195.2 301.7 198.3C301.2 201.4 300.6 204.5 300 207.6C299.4 210.7 298.8 213.8 298.1 216.9C297.5 220 296.8 223.1 296 226.2C295.3 229.3 294.5 232.3 293.7 235.4C293 238.5 292.4 241.6 291.7 244.7C291 247.8 290.3 250.9 289.4 253.9C288.6 257 287.7 260 286.8 263.1C285.9 266.1 285 269.1 283.9 272.1C282.9 275.1 281.8 278.1 280.7 281C279.6 284 278.4 286.9 277.3 289.9C276.1 292.8 275 295.8 273.8 298.7C272.7 301.7 271.5 304.6 270.4 307.6C269.2 310.5 268 313.5 266.9 316.4C265.7 319.4 264.6 322.3 263.4 325.3C262.3 328.2 261.1 331.2 260 334.1C258.8 337.1 257.7 340.1 256.5 343C255.4 345.9 254.3 348.9 253 351.8C251.7 354.7 250.2 357.5 248.9 360.4C247.5 363.2 246.1 366.1 244.7 368.9C243.3 371.8 242 374.6 240.6 377.5C239.2 380.3 237.8 383.2 236.4 386C235.1 388.9 233.5 391.6 232.3 394.6C231.1 397.4 230 400.4 229.4 403.4C228.7 406.5 228.5 409.7 228.3 412.8C228.1 416 228 419.2 228.1 422.3C228.2 425.4 228.9 428.4 228.9 431.5C228.9 434.6 228.4 437.7 228.1 440.9C227.7 444 227.4 447.2 226.6 450.3C225.9 453.2 224.3 456 223.4 458.9C222.5 461.8 221.6 464.8 221.2 467.9C220.8 471 221 474.2 221 477.4C221 480.5 221 483.7 221.1 486.9C221.1 490 221.2 493.2 221.3 496.4C221.3 499.5 221.4 502.7 221.5 505.9C221.5 509 221.6 512.2 221.7 515.4C221.8 518.5 221.8 521.7 221.9 524.9C221.9 528 221.7 531.3 222 534.4C222.4 537.4 222.9 541 224 543.3C224.8 544.9 227 547 227 547'],
    [.826, .087, 'M283.5 495.3C283.5 495.3 282.5 501.4 281.9 504.4C281.2 507.5 280.2 510.5 279.4 513.6C278.5 516.6 277.6 519.7 276.7 522.7C275.8 525.7 274.9 528.8 274 531.8C273.1 534.8 272.2 537.9 271.3 540.9C270.4 543.9 269.5 547 268.6 550C267.7 553 266.8 556.1 265.9 559.1C265 562.1 264.1 565.2 263.2 568.2C262.2 571.2 261.3 574.3 260.4 577.3C259.5 580.3 258.6 583.4 257.6 586.4C256.7 589.4 255.8 592.4 254.8 595.5C253.9 598.5 253 601.5 252 604.5C251 607.6 250.1 610.6 249.1 613.6C248.1 616.6 247.1 619.6 245.8 622.5C244.6 625.3 243.5 628.7 241.5 630.7C239.8 632.5 234.9 634.2 234.9 634.2C234.9 634.2 232.1 628.8 231.1 625.9C230.1 622.9 229.7 619.7 229 616.6C228.4 613.5 227.8 610.4 227.4 607.3C227 604.1 226.8 601 226.5 597.8C226.3 594.6 226.2 591.5 226 588.3C225.9 585.2 225.9 582 225.5 578.8C225.2 575.7 224.6 572.6 224 569.5C223.5 566.5 222.3 563.4 222.4 560.4C222.6 557.4 223.5 554 225 551.4C226.5 548.9 229.4 547.3 231.6 545.1C233.8 542.9 236 540.7 238.1 538.3C240.1 535.9 242 533.3 243.9 530.8C245.9 528.3 247.8 525.8 249.7 523.3C251.6 520.8 253.6 518.2 255.5 515.7C257.4 513.2 259.4 510.7 261.1 508.1C262.8 505.4 264 502.5 265.4 499.7C266.8 496.9 267.8 493.9 269.4 491.1C270.9 488.4 272.6 485.7 274.6 483.2C276.5 480.7 278.6 478.4 281 476.3C283.4 474.3 286.2 472.7 288.9 471C291.5 469.3 294.3 467.7 297 466.1C299.8 464.6 302.7 462.5 305.3 461.5C307.3 460.7 311 460 311 460'],
    [.948, .025, 'M302 515C302 515 303 508.7 303.5 505.6C303.9 502.5 304.4 499.3 304.8 496.2C305.2 493.1 305.6 489.9 306.1 486.8C306.5 483.7 307 480.5 307.5 477.4C307.9 474.3 308.4 471.1 309 468C309.5 464.9 310 461.8 310.8 458.7C311.6 455.7 312.4 452.5 313.8 449.7C315.1 446.9 317.2 444.2 319.2 442.1C321 440.1 325 437 325 437'],
    [.975, .025, 'M310 446L302 446'],
    [1.001, .025, 'M312.8 451.9L311 435'],
    [1.147, .036, 'M327 468C327 468 326.6 461.7 326.4 458.5C326.2 455.4 326 452.2 325.8 449C325.6 445.9 325.4 442.7 325.1 439.6C324.9 436.4 324.2 433.2 324.5 430.1C324.8 427.1 325.5 424 326.8 421.3C328.2 418.6 330.6 416.2 332.5 413.7C334.5 411.3 336.6 408.9 338.7 406.5C340.7 404.1 342.9 401.7 345 399.4C347.1 397 349.2 394.7 351.4 392.4C353.5 390 355.7 387.7 357.9 385.4C360 383.1 362.2 380.8 364.4 378.5C366.6 376.2 368.8 373.9 371 371.7C373.2 369.4 375.4 367.1 377.5 364.8C379.7 362.5 381.9 360.2 384.1 357.9C386.2 355.6 388 352.9 390.6 351C393.5 348.9 401 346 401 346'],
    [1.206, .037, 'M266 500C266 500 272 497.9 274.7 496.5C277.5 495.1 280.4 493.6 282.4 491.4C284.5 489.2 285.7 486.1 287 483.2C288.3 480.4 289.2 477.3 290.2 474.3C291.3 471.3 292.2 468.3 293.2 465.3C294.2 462.3 295.2 459.3 296.2 456.3C297.2 453.3 298.2 450.3 299.4 447.3C300.6 444.4 301.5 441.2 303.3 438.7C305 436.2 307.1 433.5 309.7 432.2C312.3 430.9 315.9 431.3 318.9 431.1C321.9 431 325.2 432.1 327.9 431.2C330.7 430.3 333 427.8 335.3 425.7C337.6 423.6 339.6 421 341.7 418.6C343.7 416.2 345.8 413.8 347.9 411.4C349.9 409 352 406.6 354.1 404.3C356.2 401.9 358 399.3 360.6 397.4C363.5 395.2 370.9 392.1 370.9 392.1'],
    [1.254, .081, 'M323 478C323 478 326.1 472.5 327.7 469.7C329.3 467 330.9 464.3 332.5 461.5C334.1 458.8 335.7 456.1 337.3 453.4C338.9 450.6 340.6 447.9 342.2 445.2C343.8 442.5 345.4 439.8 347 437C348.7 434.3 350.3 431.6 351.9 428.9C353.5 426.1 355.1 423.4 356.7 420.7C358.3 418 359.9 415.2 361.5 412.5C363.1 409.7 364.8 407 366.2 404.2C367.6 401.5 369 398.7 370.2 395.9C371.4 393.1 372.2 390 373.6 387.3C375 384.5 377 381.9 378.7 379.3C380.5 376.7 382.3 374.1 384.1 371.5C385.9 368.9 387.8 366.3 389.6 363.7C391.5 361.1 393.3 358.6 395.2 356C397.1 353.5 399.8 349.9 400.9 348.5C401.4 347.9 401.9 347.3 401.9 347.3L539.2 197.2'],
    [1.377, .126, 'M230 430L239.3 428.6L241 431.6C241 431.6 242.8 437.7 243.8 440.7C244.8 443.6 245.3 447 247 449.5C248.6 452 252.4 455 253.6 455.8C254 456 254.4 456.1 254.4 456.1C254.4 456.1 257.3 450.5 258.7 447.6C260.1 444.8 261.5 441.9 262.8 439.1C264.1 436.2 265.5 433.3 266.8 430.5C268.1 427.6 269.4 424.7 270.8 421.8C272.1 418.9 273.4 416.1 274.7 413.2C276 410.3 277.3 407.4 278.6 404.5C279.9 401.6 281.2 398.7 282.5 395.9C283.8 393 285.1 390.1 286.4 387.2C287.7 384.3 289 381.4 290.3 378.5C291.6 375.7 292.9 372.8 294.2 369.9C295.5 367 296.8 364.1 298.1 361.2C299.4 358.3 300.7 355.4 302 352.6C303.3 349.7 304.7 346.8 306 343.9C307.3 341 308.6 338.1 309.9 335.2C311.2 332.4 312.5 329.5 313.8 326.6C315.1 323.7 316.4 320.8 317.7 317.9C319 315.1 320.4 312.2 321.7 309.3C323 306.4 324.3 303.6 325.7 300.7C327.1 297.8 328.5 295 329.9 292.2C331.4 289.4 332.8 286.6 334.3 283.8C335.8 281 337.3 278.2 338.8 275.4C340.3 272.6 341.9 269.9 343.5 267.1C345.1 264.4 346.8 261.7 348.4 259C350 256.3 351.6 253.5 353.1 250.8C354.7 248 356.2 245.2 357.8 242.5C359.4 239.7 360.9 237 362.6 234.3C364.2 231.5 365.8 228.8 367.5 226.1C369.2 223.5 370.9 220.8 372.7 218.2C374.5 215.6 376.3 213 378.1 210.4C379.9 207.8 381.8 205.2 383.6 202.6C385.4 200.1 387.2 197.4 389 194.8C390.8 192.3 392.7 189.7 394.5 187.1C396.3 184.5 398.2 181.9 400 179.3C401.8 176.7 403.7 174.2 405.5 171.6C407.4 169 409.2 166.5 411.1 163.9C412.9 161.3 414.8 158.8 416.6 156.2C418.5 153.6 420.4 151.1 422.2 148.5C424.1 146 426 143.4 427.9 140.9C429.8 138.3 431.7 135.8 433.6 133.3C435.6 130.9 437.7 128.5 439.8 126.1C441.8 123.6 443.9 121.3 446 118.9C448.1 116.5 450.1 114.1 452.3 111.8C454.4 109.4 456.5 107 458.6 104.7C460.7 102.4 462.9 100 465 97.7C467.2 95.4 469.3 93 471.5 90.7C473.7 88.4 475.8 86.1 478 83.8C480.2 81.5 482.4 79.2 484.6 77C486.8 74.7 489 72.4 491.2 70.1C493.4 67.9 495.6 65.6 497.8 63.4C500.1 61.1 502.3 58.8 504.5 56.6C506.7 54.3 509 52.1 511.2 49.8C513.4 47.6 515.6 45.4 517.9 43.1C520.2 40.8 524.9 36.1 524.9 36.1'],
    [1.602, .068, 'M539.2 197.2L531 222.5C531 222.5 529.2 228.5 528.3 231.6C527.3 234.6 526.3 237.6 525.4 240.6C524.4 243.6 523.4 246.6 522.5 249.6C521.5 252.7 520.5 255.7 519.5 258.7C518.5 261.7 517.6 264.7 516.6 267.7C515.6 270.7 514.7 273.8 513.7 276.8C512.8 279.8 511.8 282.8 510.9 285.9C510 288.9 509.2 291.9 508.3 295C507.4 298 506.4 301 505.5 304.1C504.7 307.1 503.8 310.2 503 313.2C502.2 316.3 501.4 319.4 500.7 322.4C500 325.5 499.3 328.6 498.6 331.7C498 334.8 497.4 337.9 496.8 341C496.2 344.1 495.7 347.3 495.1 350.4C494.4 353.5 493.7 356.6 493.1 359.7C492.5 362.8 491.9 365.9 491.3 369C490.7 372.1 490.1 375.2 489.6 378.3C489.1 381.5 488.6 384.6 488.1 387.7C487.6 390.8 487.1 394 486.6 397.1C486.1 400.2 485.6 403.4 485.3 406.5C484.9 409.6 484.6 412.8 484.4 416C484.2 419.1 484.1 422.3 484 425.5C484 428.6 484 431.8 484.1 435C484.3 438.1 484.6 441.3 485 444.4C485.4 447.5 485.6 450.8 486.5 453.8C487.3 456.7 487.9 460.7 490.1 462.2C492.5 464 501 463 501 463'],
    [1.682, .025, 'M408 422C408 422 404.6 427.4 403.4 430.3C402.1 433.2 401.2 436.2 400.5 439.3C399.8 442.4 398.8 445.7 399.2 448.7C399.6 451.5 402.8 456.8 402.8 456.8']
  ];
  const PONTOS = [[156, 402, 1.79], [365, 294, 1.88], [492, 280, 1.97]];
  const NS = 'http://www.w3.org/2000/svg';
  const tudo = SIG.map((s) => s[2]).join('');
  $$('.sig-tudo').forEach((p) => p.setAttribute('d', tudo));
  function montarAssinatura(svg) {
    if (!svg) return { tracos: [], pontos: [] };
    const tracos = SIG.map((s) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', s[2]);
      p.setAttribute('pathLength', '1');
      svg.appendChild(p);
      return p;
    });
    const pontos = PONTOS.map((c) => {
      const e = document.createElementNS(NS, 'circle');
      e.setAttribute('cx', c[0]); e.setAttribute('cy', c[1]); e.setAttribute('r', '7');
      svg.appendChild(e);
      return e;
    });
    return { tracos, pontos };
  }
  const sigLoader = montarAssinatura($('.loader-sig'));
  const sigFim = montarAssinatura($('.cont-assin'));

  /* ---------- relógio de São Paulo ---------- */
  const relogio = () => {
    let h = '';
    try { h = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date()); } catch (e) { h = ''; }
    $$('.hora').forEach((el) => { el.textContent = h; });
  };
  relogio();
  setInterval(relogio, 20000);

  /* ---------- copiar e-mail ---------- */
  const btCopiar = $('.copiar'), aviso = $('.copiar-aviso');
  if (btCopiar) btCopiar.addEventListener('click', () => {
    const txt = 'armandociciliano@gmail.com';
    const avisar = (t) => { if (aviso) aviso.textContent = t; };
    const ok = () => { btCopiar.textContent = 'Copiado'; avisar('E-mail copiado'); setTimeout(() => { btCopiar.textContent = 'Copiar e-mail'; avisar(''); }, 2200); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents($('#email')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btCopiar.textContent = 'Selecionado, use Ctrl+C'; avisar('E-mail selecionado, use Ctrl+C para copiar'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, sel); else sel();
  });

  /* ---------- barra de rolagem: linha de neon arrastável ---------- */
  const barra = $('.barra'), barraP = $('.barra-p');
  if (barra && barraP) {
    let pedido = 0;
    const atualizar = () => {
      pedido = 0;
      const total = document.documentElement.scrollHeight, vh = innerHeight, trilho = barra.clientHeight;
      const alt = Math.max(40, trilho * Math.min(1, vh / total));
      const p = total > vh ? scrollY / (total - vh) : 0;
      barraP.style.height = alt + 'px';
      barraP.style.transform = 'translateY(' + ((trilho - alt) * p).toFixed(1) + 'px)';
      barra.style.opacity = total > vh ? '1' : '0';
    };
    const agendar = () => { if (!pedido) pedido = requestAnimationFrame(atualizar); };
    addEventListener('scroll', agendar, { passive: true });
    addEventListener('resize', agendar);
    new ResizeObserver(agendar).observe(document.body);
    atualizar();
    const irPara = (y) => {
      const r = barra.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (y - r.top) / r.height));
      const alvo = p * (document.documentElement.scrollHeight - innerHeight);
      if (window.__lenis) window.__lenis.scrollTo(alvo, { immediate: true }); else scrollTo(0, alvo);
    };
    barra.addEventListener('pointerdown', (e) => { barra.setPointerCapture(e.pointerId); barra.classList.add('arrasta'); irPara(e.clientY); });
    barra.addEventListener('pointermove', (e) => { if (barra.classList.contains('arrasta')) irPara(e.clientY); });
    const soltar = () => barra.classList.remove('arrasta');
    barra.addEventListener('pointerup', soltar);
    barra.addEventListener('pointercancel', soltar);
  }

  /* ---------- texto que preenche a largura ---------- */
  // escreve tudo, mede tudo, escreve tudo: um cálculo de layout só, em vez de um por linha
  function ajustar() {
    const linhas = $$('.fit');
    linhas.forEach((el) => { el.style.fontSize = '100px'; });
    const tamanhos = linhas.map((el) => {
      const natural = el.offsetWidth || 1;
      const escala = parseFloat(el.dataset.escala || '0');
      let alvo;
      if (escala) alvo = window.innerWidth * escala;
      else {
        const pai = el.parentElement, cs = getComputedStyle(pai);
        alvo = pai.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      }
      return Math.max(24, (alvo / natural) * 100 * 0.995);
    });
    linhas.forEach((el, i) => { el.style.fontSize = tamanhos[i] + 'px'; });
  }
  ajustar();
  // antes do load, o refresh automático do ScrollTrigger já pega as fontes; depois dele, é preciso pedir
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
    if (document.readyState === 'complete' && window.ScrollTrigger) ScrollTrigger.refresh(); else ajustar();
  });

  if (!window.gsap || !window.ScrollTrigger) {
    raiz.classList.remove('js');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  // o ScrollTrigger se recalcula sozinho no DOMContentLoaded, no load e ao redimensionar; o texto se reajusta antes de cada vez
  ScrollTrigger.addEventListener('refreshInit', ajustar);
  raiz.classList.add('pronto');

  /* ---------- rolagem suave ---------- */
  let lenis = null;
  if (!reduz && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis;
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const alvo = $(a.getAttribute('href'));
      if (!alvo) return;
      e.preventDefault();
      if (a.classList.contains('pular')) { lenis.scrollTo(alvo, { immediate: true }); alvo.focus({ preventScroll: true }); return; }
      lenis.scrollTo(alvo, { duration: 1.6 });
    }));
  }

  /* ---------- palavras ---------- */
  function partirPalavras(el) {
    if (!el || el.dataset.partido) return [];
    el.dataset.partido = '1';
    const out = [];
    const andar = (no) => {
      Array.from(no.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); out.push(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) andar(n);
      });
    };
    andar(el);
    return out;
  }

  /* ---------- loader ---------- */
  const heroImg = $('.hero-foto img');
  const linhasNome = $$('.hero-nome .fit');
  function entradaHero() {
    if (reduz) return;
    const tl = gsap.timeline();
    tl.from('.hero-fundo', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hero-foto', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0)
      .from(heroImg, { scale: 1.45, duration: 1.8, ease: 'expo.out' }, 0.15)
      .from(linhasNome, { yPercent: 110, clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.12 }, 0.35)
      .from('.hero-top, .hero-pe', { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.7);
  }
  const contador = $('.loader-n');
  if (reduz || raiz.classList.contains('sem-loader')) {
    raiz.classList.add('fim-loader');
  } else {
    const k = 0.8;
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    sigLoader.tracos.forEach((p, i) => {
      gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 });
      tl.to(p, { strokeDashoffset: 0, duration: SIG[i][1] * k }, 0.15 + SIG[i][0] * k);
    });
    sigLoader.pontos.forEach((c, i) => {
      gsap.set(c, { scale: 0, transformOrigin: '50% 50%' });
      tl.to(c, { scale: 1, duration: 0.24, ease: 'back.out(3)' }, 0.15 + PONTOS[i][2] * k);
    });
    const obj = { n: 0 };
    tl.to(obj, { n: 100, duration: tl.duration(), ease: 'power1.inOut', onUpdate: () => { if (contador) contador.textContent = String(Math.round(obj.n)).padStart(3, '0'); } }, 0);
    const pronta = heroImg && heroImg.decode ? heroImg.decode().catch(() => {}) : Promise.resolve();
    tl.eventCallback('onComplete', () => {
      pronta.then(() => {
        gsap.to('.loader', {
          yPercent: -100, duration: 0.9, ease: 'expo.inOut',
          onComplete: () => raiz.classList.add('fim-loader')
        });
        gsap.delayedCall(0.3, entradaHero);
      });
    });
  }

  /* ---------- cursor de tinta e botões magnéticos ---------- */
  const cv = $('.tinta-cv');
  const fino = window.matchMedia('(pointer: fine)').matches && !reduz;
  const ponteiro = { x: -999, y: -999, fx: -999, fy: -999, ativo: false };
  if (cv && fino) {
    const ctx = cv.getContext('2d');
    const medir = () => { const d = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    medir();
    addEventListener('resize', medir);
    const trilha = [];
    addEventListener('pointermove', (e) => {
      if (!ponteiro.ativo) { ponteiro.fx = e.clientX; ponteiro.fy = e.clientY; ponteiro.ativo = true; }
      ponteiro.x = e.clientX; ponteiro.y = e.clientY;
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { ponteiro.ativo = false; });
    let limpo = true;
    gsap.ticker.add(() => {
      if (!ponteiro.ativo && !trilha.length) {
        if (!limpo) { ctx.clearRect(0, 0, innerWidth, innerHeight); limpo = true; }
        return;
      }
      limpo = false;
      ponteiro.fx += (ponteiro.x - ponteiro.fx) * 0.28;
      ponteiro.fy += (ponteiro.y - ponteiro.fy) * 0.28;
      const agora = performance.now();
      if (ponteiro.ativo) trilha.push({ x: ponteiro.fx, y: ponteiro.fy, t: agora });
      while (trilha.length && agora - trilha[0].t > 420) trilha.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.strokeStyle = '#8EA9CC'; ctx.lineCap = 'round';
      for (let i = 1; i < trilha.length; i++) {
        const a = trilha[i - 1], b = trilha[i], vida = 1 - (agora - b.t) / 420;
        ctx.globalAlpha = Math.max(0, vida) * 0.9; ctx.lineWidth = 0.5 + vida * 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (ponteiro.ativo) { ctx.fillStyle = '#8EA9CC'; ctx.beginPath(); ctx.arc(ponteiro.fx, ponteiro.fy, 3.2, 0, Math.PI * 2); ctx.fill(); }
    });
    $$('.mag').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35); });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- contadores ---------- */
  $$('.conta').forEach((el) => {
    const alvo = +el.dataset.alvo;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true, refreshPriority: -1,
      onEnter: () => { const o = { n: 0 }; gsap.to(o, { n: alvo, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.n); } }); }
    });
  });

  /* ---------- vídeo do voo: só baixa quando a cidade se aproxima ---------- */
  const vid = $('.cena-v');
  const cidade = $('.cid');
  // chama `fn` uma vez, quando `el` chegar a `margem` (em % da altura da tela) da área visível
  function quandoPerto(el, margem, fn) {
    let feito = false;
    const ir = () => { if (feito) return; feito = true; if (io) io.disconnect(); fn(); };
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) ir(); }, { rootMargin: margem + ' 0px' }) : null;
    if (io) io.observe(el); else ir();
    return () => { feito = true; if (io) io.disconnect(); };
  }
  function trocarVideo(url, comoBlob, pronto) {
    if (vid.dataset.atual === url) { if (vid.readyState >= 2) pronto(); else vid.addEventListener('loadeddata', pronto, { once: true }); return; }
    vid.dataset.atual = url;
    vid.classList.remove('on');
    vid.preload = 'auto';
    if (vid.src.startsWith('blob:')) URL.revokeObjectURL(vid.src);
    vid.addEventListener('loadeddata', () => { if (vid.dataset.atual === url) pronto(); }, { once: true });
    if (!comoBlob) { vid.src = url; vid.load(); return; }
    // blob na memória: a busca de quadro (currentTime) fica instantânea na rolagem
    fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); }).then((b) => {
      if (vid.dataset.atual !== url) return;
      vid.src = URL.createObjectURL(b);
      vid.load();
    }).catch(() => { delete vid.dataset.atual; });
  }

  /* trajeto: estações montadas sobre a linha */
  const trajSvg = $('.traj');
  let traj = null;
  if (trajSvg) {
    const base = $('.traj-base', trajSvg), g = $('.traj-est', trajSvg);
    const L = base.getTotalLength();
    const EST = [['WhatsApp', 'Meta Cloud API', 0.02], ['Atendimento', 'IA 24h', 0.15], ['Comercial', 'Google Calendar', 0.3], ['DocShield', 'Feegow', 0.45], ['Data Agent', 'Somente leitura', 0.6], ['Dashboard', 'ERP', 0.72], ['Zeus', 'MCP', 0.86], ['Auditoria', 'Pedido registrado', 0.98]];
    const els = EST.map((e, i) => {
      const pt = base.getPointAtLength(L * e[2]);
      const gg = document.createElementNS(NS, 'g'); gg.setAttribute('class', 'est');
      const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', '9');
      const acima = i % 2 === 0;
      const n = document.createElementNS(NS, 'text'); n.setAttribute('class', 'n'); n.setAttribute('x', pt.x); n.setAttribute('y', pt.y + (acima ? -46 : 58)); n.setAttribute('text-anchor', 'middle'); n.textContent = e[0];
      const sb = document.createElementNS(NS, 'text'); sb.setAttribute('class', 's'); sb.setAttribute('x', pt.x); sb.setAttribute('y', pt.y + (acima ? -24 : 80)); sb.setAttribute('text-anchor', 'middle'); sb.textContent = e[1];
      gg.append(c, n, sb); g.appendChild(gg);
      return gg;
    });
    traj = { base, on: $('.traj-on', trajSvg), trem: $('.traj-trem', trajSvg), anel: $('.traj-anel', trajSvg), L, EST, els };
    if (!reduz) {
      // o pulso do anel só roda enquanto o trajeto está na tela
      const pulso = gsap.to(traj.anel, { attr: { r: 28 }, opacity: 0, duration: 1.5, repeat: -1, ease: 'power2.out', paused: true });
      ScrollTrigger.create({ trigger: '.sis', start: 'top bottom', end: 'bottom top', refreshPriority: -1, onToggle: (st) => (st.isActive ? pulso.play() : pulso.pause()) });
    }
  }
  const perola = $('.perola');
  if (perola) ScrollTrigger.create({ start: 0, end: 'max', refreshPriority: -1, onUpdate: (st) => perola.style.setProperty('--ang', (st.progress * 300).toFixed(1) + 'deg') });

  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    /* hero: a foto cresce até virar o fundo e o manifesto aparece por cima */
    const foto = $('.hero-foto');
    const palavras = partirPalavras($('.manif-t'));
    const fundoImg = $('.hero-fundo img');
    const tlHero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=200%', pin: true, scrub: 0.8 } });
    tlHero.to(foto, { opacity: 0, scale: 0.86, y: -40, ease: 'power2.in', duration: 0.6 }, 0)
      .to(fundoImg, { filter: 'blur(2px) brightness(0.55) saturate(1.05)', scale: 1.02, ease: 'power1.out', duration: 0.8 }, 0)
      .to('.hero-nome .l1', { xPercent: -60, opacity: 0, ease: 'power2.in', duration: 0.7 }, 0)
      .to('.hero-nome .l2', { xPercent: 60, opacity: 0, ease: 'power2.in', duration: 0.7 }, 0)
      .to('.hero-top, .hero-pe', { opacity: 0, duration: 0.3 }, 0)
      .to(fundoImg, { filter: 'blur(5px) brightness(0.32) saturate(1.05)', duration: 0.3 }, 0.8)
      .to('.manif', { opacity: 1, duration: 0.25 }, 0.8)
      .to(palavras, { opacity: 1, stagger: 0.06, duration: 0.2, ease: 'none' }, 0.9)
      .to({}, { duration: 0.4 });

    /* abordagem: o fio se desenha enquanto a seção passa */
    const fio = $('.fio-intro .fio-p');
    if (fio) {
      const L = fio.getTotalLength();
      gsap.set(fio, { strokeDasharray: L, strokeDashoffset: L });
      gsap.to(fio, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top 70%', end: 'bottom 60%', scrub: 1 } });
      gsap.from('.fio-intro circle, .fio-intro text', { opacity: 0, stagger: 0.2, scrollTrigger: { trigger: '.intro', start: 'top 40%', end: 'bottom 70%', scrub: 1 } });
    }
    $$('.intro-t .fit, .plat-t .fit, .sobre h2 .fit').forEach((l) => {
      gsap.from(l, { yPercent: 100, clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 88%' } });
    });
    gsap.from('.intro-lede', { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.intro-lede', start: 'top 85%' } });
    gsap.from('.princ article', { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.princ', start: 'top 80%' } });
    $$('.princ svg').forEach((svg) => {
      $$('path, rect, circle', svg).forEach((s) => {
        const L = s.getTotalLength ? s.getTotalLength() : 200;
        gsap.fromTo(s, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: svg, start: 'top 85%' } });
      });
    });

    /* plataforma: a faixa de nomes anda com a rolagem */
    gsap.fromTo('.faixa', { xPercent: 5 }, { xPercent: -42, ease: 'none', scrollTrigger: { trigger: '.plat', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    gsap.from('.plat-g p, .nums div', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.plat-g', start: 'top 85%' } });

    /* trajeto: um ponto percorre a linha e acende as estações */
    if (traj) {
      gsap.set(traj.on, { strokeDasharray: traj.L, strokeDashoffset: traj.L });
      const passos = $$('.passo'), barras = $$('.prog i');
      gsap.set(passos, { opacity: 0, y: 30 });
      let atual = -1;
      const mostrar = (k) => {
        if (k === atual) return;
        passos.forEach((p, i) => gsap.to(p, { opacity: i === k ? 1 : 0, y: i === k ? 0 : (i < k ? -30 : 30), duration: 0.5, ease: 'power3.out', overwrite: true }));
        atual = k;
      };
      const prox = { p: 0 };
      const andar = () => {
        const p = prox.p, d = traj.L * p;
        traj.on.style.strokeDashoffset = traj.L - d;
        const pt = traj.base.getPointAtLength(d);
        [traj.trem, traj.anel].forEach((c) => { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); });
        traj.els.forEach((e, i) => e.classList.toggle('on', traj.EST[i][2] <= p + 0.005));
        mostrar(Math.min(4, Math.floor(p * 5)));
        barras.forEach((b, i) => { b.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p * 5 - i)) + ')'; });
      };
      andar();
      gsap.timeline({ scrollTrigger: { trigger: '.sis', start: 'top top', end: '+=420%', pin: true, scrub: 0.6 } })
        .to(prox, { p: 1, ease: 'none', duration: 1, onUpdate: andar });
    }

    /* casos: nome gigante atravessa, as telas montam por cima */
    $$('.caso').forEach((caso) => {
      const nome = $('.caso-nome .fit', caso);
      const pecas = $$('.peca', caso);
      const info = $('.caso-info', caso);
      const tl = gsap.timeline({ scrollTrigger: { trigger: caso, start: 'top top', end: '+=170%', pin: true, scrub: 0.8 } });
      tl.fromTo(nome, { x: () => innerWidth * 0.12 }, { x: () => -(nome.offsetWidth - innerWidth * 0.75), ease: 'none', duration: 1 }, 0);
      pecas.forEach((p, i) => {
        const z = parseFloat(p.dataset.z || '1');
        tl.from(p, { y: () => innerHeight * (0.55 + 0.3 * z), rotation: (i % 2 ? 7 : -6) * z, opacity: 0, ease: 'power3.out', duration: 0.35 }, 0.04 + i * 0.07)
          .to(p, { y: () => -innerHeight * 0.06 * z, ease: 'none', duration: 0.55 }, 0.45);
      });
      tl.from(info, { y: 60, opacity: 0, duration: 0.25, ease: 'power3.out' }, 0.1);
      const seq = $$('.seq', caso);
      if (seq.length) { gsap.set(seq, { opacity: 0, y: 14 }); tl.to(seq, { opacity: 1, y: 0, stagger: 0.08, duration: 0.08 }, 0.4); }
      $$('.mfa span', caso).forEach((d, i) => { gsap.set(d, { color: 'transparent', borderColor: '#3A3632' }); tl.to(d, { color: '#EEE7DD', borderColor: '#8EA9CC', duration: 0.04 }, 0.42 + i * 0.04); });
      $$('.aprovar', caso).forEach((b) => { tl.to(b, { scale: 1.08, backgroundColor: '#8EA9CC', borderColor: '#8EA9CC', color: '#111', duration: 0.06, yoyo: true, repeat: 1 }, 0.78); });
      const assina = $('.assina', caso);
      if (assina) {
        const estado = $('.estado', caso), cont = $('.cont-docs', caso), barra = $('.barra-docs', caso);
        tl.to(assina, { backgroundColor: '#8EA9CC', duration: 0.05 }, 0.7)
          .to(barra, { width: '80%', duration: 0.1 }, 0.7)
          .add(() => { if (estado) estado.textContent = tl.progress() >= 0.7 ? 'Assinado' : 'Aguardando'; if (cont) cont.textContent = tl.progress() >= 0.7 ? '4' : '3'; }, 0.7);
        const docAss = $('.doc-assin path', caso);
        if (docAss) { gsap.set(docAss, { strokeDasharray: 1, strokeDashoffset: 1, attr: { pathLength: 1 } }); tl.to(docAss, { strokeDashoffset: 0, duration: 0.2, ease: 'none' }, 0.55); }
      }
      $$('.barras span', caso).forEach((b, i) => tl.from(b, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.15 }, 0.35 + i * 0.04));
      const fin = $('.linha-fin', caso);
      if (fin) { gsap.set(fin, { attr: { pathLength: 1 }, strokeDasharray: 1, strokeDashoffset: 1 }); tl.to(fin, { strokeDashoffset: 0, duration: 0.3 }, 0.4); }
      $$('.nps', caso).forEach((b, i) => tl.from(b, { scaleX: 0, transformOrigin: '0 50%', duration: 0.15 }, 0.45 + i * 0.05));
    });

    /* cidade: mergulho na tela e voo em vídeo comandado pela rolagem */
    const alvoV = { t: 0 };
    let durV = 0;
    const pararPerto = vid && cidade ? quandoPerto(cidade, '300%', () => {
      trocarVideo(vid.dataset.src, true, () => { vid.pause(); durV = vid.duration || 0; vid.classList.add('on'); });
    }) : () => {};
    const buscar = () => { if (durV && !vid.seeking && Math.abs(vid.currentTime - alvoV.t) > 0.02) vid.currentTime = alvoV.t; };
    gsap.ticker.add(buscar);
    gsap.timeline({ scrollTrigger: { trigger: cidade, start: 'top top', end: '+=380%', pin: true, scrub: 0.8,
        onUpdate: (st) => { alvoV.t = Math.min(1, Math.max(0, (st.progress - 0.1) / 0.85)) * Math.max(0, durV - 0.05); } } })
      .from('.cid-b1', { opacity: 0, y: 40, duration: 0.05 }, 0)
      .to('.tela', { scale: 4.2, opacity: 0, ease: 'power2.in', duration: 0.2 }, 0.04)
      .to('.cid-b1', { opacity: 0, y: -40, duration: 0.06 }, 0.2)
      .from('.cid-b2', { opacity: 0, y: 60, duration: 0.12 }, 0.8)
      .to({}, { duration: 0.08 }, 0.92);

    /* túnel: a câmera atravessa as fotos */
    const cena = $('.tunel-cena');
    const fotos = $$('.tf');
    const zs = fotos.map((f) => parseFloat(getComputedStyle(f).getPropertyValue('--z')) || 0);
    const prof = 3300 + 900;
    const aplicarZ = (z) => {
      cena.style.transform = 'translate3d(0,0,' + z + 'px)';
      fotos.forEach((f, i) => {
        const ez = zs[i] + z;
        let o = Math.min(1, Math.max(0, (ez + 2600) / 1400));
        if (ez > 350) o *= Math.max(0, 1 - (ez - 350) / 350);
        f.style.opacity = o.toFixed(3);
      });
    };
    aplicarZ(0);
    const tz = { z: 0 };
    gsap.timeline({ scrollTrigger: { trigger: '.tunel', start: 'top top', end: '+=320%', pin: true, scrub: 0.8 } })
      .to(tz, { z: prof, ease: 'none', duration: 1, onUpdate: () => aplicarZ(tz.z) }, 0)
      .to('.tunel-txt', { opacity: 1, duration: 0.12 }, 0.84);

    /* sobre e diário */
    gsap.from('.sobre-foto', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.sobre-foto', start: 'top 80%' } });
    gsap.fromTo('.sobre-foto img', { scale: 1.3, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.sobre', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.linha-t div, .comp dt, .comp dd', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.04, scrollTrigger: { trigger: '.linha-t', start: 'top 85%' } });
    const qPal = partirPalavras($('.diario-q'));
    gsap.set(qPal, { opacity: 0.15 });
    gsap.to(qPal, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.diario', start: 'top 70%', end: 'top 10%', scrub: true } });
    gsap.from('.cit figure', { y: 80, opacity: 0, rotation: (i) => [-3, 2, -2][i % 3], duration: 1.1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.cit', start: 'top 82%' } });

    /* atlas: a captura se endireita */
    gsap.fromTo('.atlas-moldura', { rotationX: 34, scale: 0.84, y: 60 }, { rotationX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.atlas-cena', start: 'top 95%', end: 'top 25%', scrub: 0.8 } });
    gsap.from('.dec article, .arq div', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: '.dec', start: 'top 85%' } });

    /* contato: o retrato sobe e a assinatura é escrita por cima */
    gsap.from('.cont-foto .ft', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.cont-foto', start: 'top 85%' } });
    gsap.fromTo('.cont-foto img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cont-foto', start: 'top bottom', end: 'bottom 40%', scrub: true } });
    gsap.fromTo('.mq', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.contato', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
    const tlAss = gsap.timeline({ scrollTrigger: { trigger: '.cont-assin', start: 'top 85%', end: 'top 35%', scrub: 0.6 } });
    sigFim.tracos.forEach((p, i) => { gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 }); tlAss.to(p, { strokeDashoffset: 0, duration: SIG[i][1], ease: 'none' }, SIG[i][0]); });
    sigFim.pontos.forEach((c, i) => { gsap.set(c, { scale: 0, transformOrigin: '50% 50%' }); tlAss.to(c, { scale: 1, duration: 0.08 }, PONTOS[i][2]); });
    gsap.from('.lin', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: '.outros', start: 'top 80%' } });

    return () => { gsap.ticker.remove(buscar); pararPerto(); durV = 0; };
  });

  mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
    $$('.passo').forEach((p) => gsap.set(p, { clearProps: 'all' }));
    if (traj) { traj.els.forEach((e) => e.classList.add('on')); gsap.set(traj.on, { strokeDashoffset: 0 }); }
    if (reduz) return;
    $$('.peca, .princ article, .cit figure, .dec article, .lin').forEach((el) => {
      gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    /* celular: voo vertical em loop, tocando só enquanto a cidade está na tela */
    if (!vid || !cidade || !('IntersectionObserver' in window)) return;
    let visivel = false;
    const tocar = () => { if (visivel && vid.classList.contains('on')) vid.play().catch(() => {}); };
    const pararPerto = quandoPerto(cidade, '150%', () => {
      vid.loop = true;
      trocarVideo(vid.dataset.srcM, false, () => { vid.classList.add('on'); tocar(); });
    });
    const io = new IntersectionObserver((es) => {
      visivel = es[0].isIntersecting;
      if (visivel) tocar(); else vid.pause();
    }, { threshold: 0.25 });
    io.observe(cidade);
    return () => { pararPerto(); io.disconnect(); vid.pause(); vid.loop = false; };
  });

  addEventListener('resize', () => { ajustar(); });
})();
