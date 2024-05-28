import React, { PureComponent, Fragment } from 'react';

import arrow from 'assets/svg/general/arrow.svg';
import bit from 'assets/svg/general/bit_solid.svg';
import bitshop from 'assets/svg/general/bitshop.svg';
import bullets from 'assets/svg/general/bullets.svg';
import file from 'assets/svg/general/file.svg';
import folder from 'assets/svg/general/folder.svg';

import accept from 'assets/svg/actions/accept.svg';
import back from 'assets/svg/actions/back.svg';
import cancel from 'assets/svg/actions/cancel.svg';
import change from 'assets/svg/actions/change.svg';
import color from 'assets/svg/actions/color.svg';
import copy from 'assets/svg/actions/copy.svg';
import create from 'assets/svg/actions/create.svg';
import createThin from 'assets/svg/actions/create-thin-white.svg';
import decline from 'assets/svg/actions/decline.svg';
import deleteSvg from 'assets/svg/actions/delete.svg';
import download from 'assets/svg/actions/download.svg';
import edit from 'assets/svg/actions/edit.svg';
import favourite from 'assets/svg/actions/favourite.svg';
import hide from 'assets/svg/actions/hide.svg';
import logout from 'assets/svg/actions/logout.svg';
import move from 'assets/svg/actions/move.svg';
import replace from 'assets/svg/actions/replace.svg';
import search from 'assets/svg/actions/search.svg';
import share from 'assets/svg/actions/share.svg';
import shortcut from 'assets/svg/actions/shortcut.svg';
import show from 'assets/svg/actions/show.svg';
import upload from 'assets/svg/actions/upload.svg';

import teammates from 'assets/svg/team/teammates.svg';
import user from 'assets/svg/team/user.svg';
import invitations from 'assets/svg/team/invitations.svg';
import settings from 'assets/svg/team/settings.svg';
import sandbox from 'assets/svg/team/sandbox.svg';

import gototeams from 'assets/svg/public/go_to_teams.svg';

import administration from 'assets/svg/ybit/administration.svg';

import notifications from 'assets/svg/general/notifications.svg';

class ButtonIcon extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            icons: {
                arrow,
                bit,
                bitshop,
                bullets,
                file,
                folder,

                accept,
                back,
                cancel,
                change,
                color,
                copy,
                create,
                'create-thin': createThin,
                upload,
                decline,
                delete: deleteSvg,
                download,
                edit,
                favourite,
                hide,
                logout,
                move,
                replace,
                search,
                share,
                shortcut,
                show,

                teammates,
                user,
                invitations,
                settings,
                sandbox,

                administration,
                gototeams,
                notifications
            }
        };
    }

    render() {
        const { icon, iconClassName, width, height } = this.props;

        return (
            <Fragment>
                {icon && this.state.icons[icon] ? (
                    <img
                        src={this.state.icons[icon]}
                        width={width ? width : 16}
                        height={height ? height : 16}
                        className={iconClassName ? iconClassName : ''}
                    />
                ) : null}
                {this.props.children}
            </Fragment>
        );
    }
}

export default ButtonIcon;
