import React from 'react';

import { TextPin, TextPinView } from './pinTypes/textPin';
import { VideoPin, VideoPinView } from './pinTypes/videoPin';
import { PhotoPin, PhotoPinView } from './pinTypes/photoPin';
import { ReminderPin, ReminderPinView } from './pinTypes/reminderPin';
import { AnnouncementPin, AnnouncementPinView } from './pinTypes/announcementPin';

export const pinComponents = {
  photo: props => <PhotoPin {...props} />,
  text: props => <TextPin {...props} />,
  video: props => <VideoPin {...props} />,
  reminder: props => <ReminderPin {...props} />,
  map: () => <div>map</div>,
  announcement: props => <AnnouncementPin {...props} />
};

export const pinViews = {
  photo: props => <PhotoPinView {...props} />,
  text: props => <TextPinView {...props} />,
  video: props => <VideoPinView {...props} />,
  reminder: props => <ReminderPinView {...props} />,
  map: 'map',
  announcement: props => <AnnouncementPinView {...props} />
};
